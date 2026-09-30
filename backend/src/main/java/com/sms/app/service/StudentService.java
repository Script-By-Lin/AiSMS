package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.event.StudentCreatedEvent;
import com.sms.app.exception.BadRequestException;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CourseRepository courseRepository;
    private final ParentRepository parentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentDocumentRepository studentDocumentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;
    private final EntityMapper mapper;

    @Transactional
    public StudentResponse createStudent(StudentCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already in use");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        Role studentRole = roleRepository.findByName(RoleType.ROLE_STUDENT)
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_STUDENT not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .active(true)
                .roles(Set.of(studentRole))
                .build();
        user = userRepository.save(user);

        String studentCode = request.getStudentCode();
        if (studentCode == null || studentCode.trim().isEmpty()) {
            studentCode = "STU-" + LocalDate.now().getYear() + "-" + String.format("%04d", System.currentTimeMillis() % 10000);
        }

        Parent parent = null;
        if (request.getParentId() != null) {
            parent = parentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + request.getParentId()));
        }

        Student student = Student.builder()
                .user(user)
                .studentCode(studentCode)
                .dob(request.getDob())
                .gender(request.getGender())
                .address(request.getAddress())
                .emergencyContact(request.getEmergencyContact())
                .parent(parent)
                .build();
        student = studentRepository.save(student);

        if (request.getInitialCourseId() != null) {
            Course course = courseRepository.findById(request.getInitialCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getInitialCourseId()));
            Enrollment enrollment = Enrollment.builder()
                    .student(student)
                    .course(course)
                    .enrollmentDate(LocalDate.now())
                    .status("ACTIVE")
                    .build();
            enrollmentRepository.save(enrollment);
            student.getEnrollments().add(enrollment);
        }

        eventPublisher.publishEvent(new StudentCreatedEvent(this, student.getId(), student.getStudentCode(), user.getId(), user.getFullName()));

        StudentResponse response = mapper.toStudentResponse(student);
        computeMetrics(student.getId(), response);
        return response;
    }

    @Transactional
    @CacheEvict(value = "students", key = "#id")
    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (request.getFullName() != null) student.getUser().setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) student.getUser().setPhoneNumber(request.getPhoneNumber());
        if (request.getDob() != null) student.setDob(request.getDob());
        if (request.getGender() != null) student.setGender(request.getGender());
        if (request.getAddress() != null) student.setAddress(request.getAddress());
        if (request.getEmergencyContact() != null) student.setEmergencyContact(request.getEmergencyContact());

        if (request.getParentId() != null) {
            Parent parent = parentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + request.getParentId()));
            student.setParent(parent);
        }

        studentRepository.save(student);
        StudentResponse response = mapper.toStudentResponse(student);
        computeMetrics(id, response);
        return response;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "students", key = "#id")
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        StudentResponse response = mapper.toStudentResponse(student);
        computeMetrics(id, response);
        return response;
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentByCode(String code) {
        Student student = studentRepository.findByStudentCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + code));
        StudentResponse response = mapper.toStudentResponse(student);
        computeMetrics(student.getId(), response);
        return response;
    }

    @Transactional(readOnly = true)
    public PageResponse<StudentResponse> getAllStudents(Pageable pageable) {
        Page<Student> page = studentRepository.findByIsDeletedFalse(pageable);
        List<StudentResponse> list = page.getContent().stream()
                .map(s -> {
                    StudentResponse r = mapper.toStudentResponse(s);
                    computeMetrics(s.getId(), r);
                    return r;
                })
                .collect(Collectors.toList());

        return PageResponse.<StudentResponse>builder()
                .content(list)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional
    public void enrollInCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new BadRequestException("Student is already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrollmentDate(LocalDate.now())
                .status("ACTIVE")
                .build();
        enrollmentRepository.save(enrollment);
    }

    @Transactional
    public StudentDocumentDto uploadDocument(Long studentId, String name, String type, String url) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        StudentDocument doc = StudentDocument.builder()
                .student(student)
                .documentName(name)
                .documentType(type)
                .fileUrl(url)
                .build();
        doc = studentDocumentRepository.save(doc);
        return mapper.toStudentDocumentDto(doc);
    }

    @Transactional(readOnly = true)
    public List<StudentDocumentDto> getStudentDocuments(Long studentId) {
        return studentDocumentRepository.findByStudentId(studentId).stream()
                .map(mapper::toStudentDocumentDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + id));
        student.setIsDeleted(true);
        student.getUser().setIsDeleted(true);
        studentRepository.save(student);
    }

    private void computeMetrics(Long studentId, StudentResponse response) {
        long totalAtt = attendanceRepository.countByStudentId(studentId);
        long presAtt = attendanceRepository.countPresentByStudentId(studentId);
        double attRate = totalAtt == 0 ? 100.0 : ((double) presAtt / totalAtt) * 100.0;
        response.setAttendancePercentage(Math.round(attRate * 10.0) / 10.0);

        Double avgMarks = resultRepository.calculateAverageMarksByStudentId(studentId);
        response.setAverageMarks(avgMarks != null ? Math.round(avgMarks * 100.0) / 100.0 : 0.0);
    }
}
