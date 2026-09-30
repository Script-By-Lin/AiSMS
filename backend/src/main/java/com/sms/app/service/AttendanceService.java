package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.event.AttendanceMarkedEvent;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final EntityMapper mapper;

    @Transactional
    public AttendanceResponse markAttendance(AttendanceMarkRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));
        }

        Attendance attendance = attendanceRepository
                .findByStudentIdAndAttendanceDateAndSubjectId(request.getStudentId(), request.getAttendanceDate(), request.getSubjectId())
                .orElse(Attendance.builder()
                        .student(student)
                        .course(course)
                        .subject(subject)
                        .attendanceDate(request.getAttendanceDate())
                        .build());

        attendance.setStatus(request.getStatus());
        attendance.setRemarks(request.getRemarks());
        attendance = attendanceRepository.save(attendance);

        eventPublisher.publishEvent(new AttendanceMarkedEvent(
                this,
                attendance.getId(),
                student.getId(),
                course.getId(),
                attendance.getAttendanceDate(),
                attendance.getStatus()
        ));

        return mapper.toAttendanceResponse(attendance);
    }

    @Transactional(readOnly = true)
    public PageResponse<AttendanceResponse> getAttendanceByStudent(Long studentId, Pageable pageable) {
        Page<Attendance> page = attendanceRepository.findByStudentId(studentId, pageable);
        List<AttendanceResponse> content = page.getContent().stream()
                .map(mapper::toAttendanceResponse)
                .collect(Collectors.toList());

        return PageResponse.<AttendanceResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public AttendanceSummaryDto getAttendanceSummary(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        long total = attendanceRepository.countByStudentId(studentId);
        long present = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        long absent = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.ABSENT);
        long late = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.LATE);
        long excused = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.EXCUSED);

        double pct = total == 0 ? 100.0 : ((double) present / total) * 100.0;

        return AttendanceSummaryDto.builder()
                .studentId(studentId)
                .studentCode(student.getStudentCode())
                .studentName(student.getUser().getFullName())
                .totalClasses(total)
                .presentCount(present)
                .absentCount(absent)
                .lateCount(late)
                .excusedCount(excused)
                .percentage(Math.round(pct * 10.0) / 10.0)
                .lowAttendanceAlert(pct < 75.0)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByCourseAndDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndAttendanceDate(courseId, date).stream()
                .map(mapper::toAttendanceResponse)
                .collect(Collectors.toList());
    }
}
