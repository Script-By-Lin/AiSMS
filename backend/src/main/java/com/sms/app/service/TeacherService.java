package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.exception.BadRequestException;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityMapper mapper;

    @Transactional
    public TeacherResponse createTeacher(TeacherCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Role teacherRole = roleRepository.findByName(RoleType.ROLE_TEACHER)
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_TEACHER not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .active(true)
                .roles(Set.of(teacherRole))
                .build();
        user = userRepository.save(user);

        String employeeCode = request.getEmployeeCode();
        if (employeeCode == null || employeeCode.trim().isEmpty()) {
            employeeCode = "TCH-" + String.format("%04d", System.currentTimeMillis() % 10000);
        }

        Teacher teacher = Teacher.builder()
                .user(user)
                .employeeCode(employeeCode)
                .specialization(request.getSpecialization())
                .qualification(request.getQualification())
                .hireDate(request.getHireDate())
                .build();
        teacher = teacherRepository.save(teacher);

        return mapper.toTeacherResponse(teacher);
    }

    @Transactional(readOnly = true)
    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        return mapper.toTeacherResponse(teacher);
    }

    @Transactional(readOnly = true)
    public PageResponse<TeacherResponse> getAllTeachers(Pageable pageable) {
        Page<Teacher> page = teacherRepository.findAll(pageable);
        List<TeacherResponse> content = page.getContent().stream()
                .map(mapper::toTeacherResponse)
                .collect(Collectors.toList());

        return PageResponse.<TeacherResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional
    public void assignCourse(Long teacherId, Long courseId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + teacherId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        course.setTeacher(teacher);
        courseRepository.save(course);
    }

    @Transactional(readOnly = true)
    public List<CourseDto> getAssignedCourses(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId).stream()
                .map(mapper::toCourseDto)
                .collect(Collectors.toList());
    }
}
