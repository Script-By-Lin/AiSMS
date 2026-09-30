package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.exception.BadRequestException;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.exception.UnauthorizedException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import com.sms.app.security.JwtUtils;
import com.sms.app.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ParentRepository parentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final EntityMapper mapper;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        String accessToken = jwtUtils.generateAccessToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(userPrincipal.getUsername());

        Set<String> roles = userPrincipal.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toSet());

        Long profileId = resolveProfileId(userPrincipal.getId(), roles);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtils.getExpirationMs())
                .userId(userPrincipal.getId())
                .username(userPrincipal.getUsername())
                .email(userPrincipal.getEmail())
                .fullName(userPrincipal.getFullName())
                .roles(roles)
                .profileId(profileId)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Set<Role> roles = new HashSet<>();
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName(RoleType.ROLE_STUDENT)
                    .orElseThrow(() -> new ResourceNotFoundException("Default role ROLE_STUDENT not found"));
            roles.add(defaultRole);
        } else {
            for (String roleStr : request.getRoles()) {
                String roleFormatted = roleStr.toUpperCase().startsWith("ROLE_") ? roleStr.toUpperCase() : "ROLE_" + roleStr.toUpperCase();
                Role role = roleRepository.findByName(RoleType.valueOf(roleFormatted))
                        .orElseThrow(() -> new BadRequestException("Invalid role specified: " + roleStr));
                roles.add(role);
            }
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .active(true)
                .roles(roles)
                .build();

        user = userRepository.save(user);

        // Auto-provision profile based on primary role
        Long profileId = null;
        if (roles.stream().anyMatch(r -> r.getName() == RoleType.ROLE_STUDENT)) {
            String studentCode = "STU-" + System.currentTimeMillis() % 100000;
            Student student = Student.builder()
                    .user(user)
                    .studentCode(studentCode)
                    .build();
            student = studentRepository.save(student);
            profileId = student.getId();
        } else if (roles.stream().anyMatch(r -> r.getName() == RoleType.ROLE_TEACHER)) {
            String empCode = "EMP-" + System.currentTimeMillis() % 100000;
            Teacher teacher = Teacher.builder()
                    .user(user)
                    .employeeCode(empCode)
                    .build();
            teacher = teacherRepository.save(teacher);
            profileId = teacher.getId();
        } else if (roles.stream().anyMatch(r -> r.getName() == RoleType.ROLE_PARENT)) {
            Parent parent = Parent.builder()
                    .user(user)
                    .build();
            parent = parentRepository.save(parent);
            profileId = parent.getId();
        }

        List<String> roleNames = roles.stream().map(r -> r.getName().name()).collect(Collectors.toList());
        String accessToken = jwtUtils.generateAccessTokenFromUsername(user.getUsername(), user.getId(), user.getEmail(), roleNames);
        String refreshToken = jwtUtils.generateRefreshToken(user.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtils.getExpirationMs())
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(new HashSet<>(roleNames))
                .profileId(profileId)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!jwtUtils.validateJwtToken(token)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String username = jwtUtils.getUsernameFromJwtToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<String> roles = user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList());
        String newAccessToken = jwtUtils.generateAccessTokenFromUsername(user.getUsername(), user.getId(), user.getEmail(), roles);

        Long profileId = resolveProfileId(user.getId(), new HashSet<>(roles));

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtUtils.getExpirationMs())
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(new HashSet<>(roles))
                .profileId(profileId)
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("No authenticated user found");
        }
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + auth.getName()));

        return mapper.toUserDto(user);
    }

    private Long resolveProfileId(Long userId, Set<String> roles) {
        if (roles.contains("ROLE_STUDENT")) {
            return studentRepository.findByUserId(userId).map(Student::getId).orElse(null);
        } else if (roles.contains("ROLE_TEACHER")) {
            return teacherRepository.findByUserId(userId).map(Teacher::getId).orElse(null);
        } else if (roles.contains("ROLE_PARENT")) {
            return parentRepository.findByUserId(userId).map(Parent::getId).orElse(null);
        }
        return null;
    }
}
