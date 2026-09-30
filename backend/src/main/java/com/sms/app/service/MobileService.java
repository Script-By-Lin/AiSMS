package com.sms.app.service;

import com.sms.app.ai.GeminiService;
import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MobileService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final TeacherRepository teacherRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final InvoiceRepository invoiceRepository;
    private final NotificationRepository notificationRepository;
    private final CourseRepository courseRepository;
    private final GeminiService geminiService;
    private final EntityMapper mapper;

    @Cacheable(value = "mobile_dashboards", key = "#userId")
    @Transactional(readOnly = true)
    public MobileDashboardResponse getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        boolean isStudent = user.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_STUDENT);
        boolean isParent = user.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_PARENT);
        boolean isTeacher = user.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ROLE_TEACHER);

        List<NotificationResponse> unreadNotifs = notificationRepository.findTop5ByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(mapper::toNotificationResponse)
                .collect(Collectors.toList());

        if (isStudent) {
            Student student = studentRepository.findByUserId(userId).orElse(null);
            if (student != null) {
                return buildStudentDashboard(user, student, unreadNotifs);
            }
        } else if (isParent) {
            Parent parent = parentRepository.findByUserId(userId).orElse(null);
            if (parent != null && !parent.getStudents().isEmpty()) {
                Student firstChild = parent.getStudents().get(0);
                return buildStudentDashboard(user, firstChild, unreadNotifs);
            }
        } else if (isTeacher) {
            Teacher teacher = teacherRepository.findByUserId(userId).orElse(null);
            if (teacher != null) {
                List<CourseDto> courses = courseRepository.findByTeacherId(teacher.getId()).stream()
                        .map(mapper::toCourseDto)
                        .collect(Collectors.toList());

                return MobileDashboardResponse.builder()
                        .userRole("TEACHER")
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .currentCourses(courses)
                        .unreadNotifications(unreadNotifs)
                        .aiInsights(List.of("Attendance submissions are up to date for this week.", "Upcoming midterm examination grading window opens Friday."))
                        .build();
            }
        }

        return MobileDashboardResponse.builder()
                .userRole("ADMIN")
                .fullName(user.getFullName())
                .email(user.getEmail())
                .unreadNotifications(unreadNotifs)
                .aiInsights(List.of("System operating at optimal performance.", "All modular monolith services are healthy."))
                .build();
    }

    private MobileDashboardResponse buildStudentDashboard(User user, Student student, List<NotificationResponse> notifs) {
        long totalAtt = attendanceRepository.countByStudentId(student.getId());
        long presAtt = attendanceRepository.countPresentByStudentId(student.getId());
        double attRate = totalAtt == 0 ? 100.0 : ((double) presAtt / totalAtt) * 100.0;

        Double avgMarks = resultRepository.calculateAverageMarksByStudentId(student.getId());
        double marks = avgMarks != null ? avgMarks : 0.0;

        List<CourseDto> courses = student.getEnrollments() != null
                ? student.getEnrollments().stream().map(Enrollment::getCourse).map(mapper::toCourseDto).collect(Collectors.toList())
                : Collections.emptyList();

        List<AttendanceResponse> recentAttendance = attendanceRepository.findTop5ByStudentIdOrderByAttendanceDateDesc(student.getId()).stream()
                .map(mapper::toAttendanceResponse)
                .collect(Collectors.toList());

        List<ResultDto> recentResults = resultRepository.findTop5ByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                .map(mapper::toResultDto)
                .collect(Collectors.toList());

        List<InvoiceResponse> unpaidInvoices = invoiceRepository.findByStudentIdAndStatus(student.getId(), InvoiceStatus.UNPAID).stream()
                .map(mapper::toInvoiceResponse)
                .collect(Collectors.toList());

        List<String> aiInsights = new ArrayList<>();
        if (attRate < 75.0) {
            aiInsights.add(String.format("Attendance Alert: Your attendance (%.1f%%) has dropped below 75%%.", attRate));
        } else {
            aiInsights.add(String.format("Good job! Your attendance is strong at %.1f%%.", attRate));
        }
        if (marks >= 80.0) {
            aiInsights.add(String.format("Academic Excellence: You are maintaining an average score of %.1f%%!", marks));
        } else if (marks > 0) {
            aiInsights.add(String.format("Targeted Advice: Consistent daily revision will push your current average (%.1f%%) to distinction.", marks));
        }

        return MobileDashboardResponse.builder()
                .userRole("STUDENT")
                .fullName(student.getUser().getFullName())
                .email(student.getUser().getEmail())
                .attendancePercentage(Math.round(attRate * 10.0) / 10.0)
                .gpaOrAverageScore(Math.round(marks * 100.0) / 100.0)
                .currentCourses(courses)
                .recentAttendance(recentAttendance)
                .recentResults(recentResults)
                .pendingInvoices(unpaidInvoices)
                .unreadNotifications(notifs)
                .aiInsights(aiInsights)
                .build();
    }
}
