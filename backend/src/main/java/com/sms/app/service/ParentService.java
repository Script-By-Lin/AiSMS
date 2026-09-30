package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.exception.BadRequestException;
import com.sms.app.exception.ForbiddenException;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentService {

    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final InvoiceRepository invoiceRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityMapper mapper;

    @Transactional
    public ParentResponse createParent(ParentCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        Role parentRole = roleRepository.findByName(RoleType.ROLE_PARENT)
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_PARENT not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .active(true)
                .roles(Set.of(parentRole))
                .build();
        user = userRepository.save(user);

        final Parent parent = parentRepository.save(Parent.builder()
                .user(user)
                .occupation(request.getOccupation())
                .relationship(request.getRelationship() != null ? request.getRelationship() : "PARENT")
                .build());

        if (request.getStudentCodes() != null) {
            for (String code : request.getStudentCodes()) {
                studentRepository.findByStudentCode(code).ifPresent(s -> {
                    s.setParent(parent);
                    studentRepository.save(s);
                    parent.getStudents().add(s);
                });
            }
        }

        return mapper.toParentResponse(parent);
    }

    @Transactional
    public void linkChild(Long parentId, String studentCode) {
        Parent parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + parentId));

        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + studentCode));

        student.setParent(parent);
        studentRepository.save(student);
    }

    @Transactional(readOnly = true)
    public ParentResponse getParentById(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + id));
        return mapper.toParentResponse(parent);
    }

    @Transactional(readOnly = true)
    public ParentResponse getParentByUserId(Long userId) {
        Parent parent = parentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent profile not found for user: " + userId));
        return mapper.toParentResponse(parent);
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getChildAttendance(Long parentId, Long studentId) {
        verifyParentChildLink(parentId, studentId);
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(mapper::toAttendanceResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResultDto> getChildResults(Long parentId, Long studentId) {
        verifyParentChildLink(parentId, studentId);
        return resultRepository.findByStudentId(studentId).stream()
                .map(mapper::toResultDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getChildInvoices(Long parentId, Long studentId) {
        verifyParentChildLink(parentId, studentId);
        return invoiceRepository.findByStudentId(studentId).stream()
                .map(mapper::toInvoiceResponse)
                .collect(Collectors.toList());
    }

    private void verifyParentChildLink(Long parentId, Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        if (student.getParent() == null || !student.getParent().getId().equals(parentId)) {
            throw new ForbiddenException("You are not authorized to view information for this student");
        }
    }
}
