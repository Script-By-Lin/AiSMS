package com.sms.app.listener;

import com.sms.app.ai.GeminiService;
import com.sms.app.dto.SmartAlertResponse;
import com.sms.app.entity.Notification;
import com.sms.app.entity.NotificationType;
import com.sms.app.entity.Student;
import com.sms.app.event.AttendanceMarkedEvent;
import com.sms.app.repository.NotificationRepository;
import com.sms.app.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AttendanceEventListener {

    private final StudentRepository studentRepository;
    private final NotificationRepository notificationRepository;
    private final GeminiService geminiService;

    @Async("taskExecutor")
    @EventListener
    public void handleAttendanceMarked(AttendanceMarkedEvent event) {
        log.info("Handling AttendanceMarkedEvent asynchronously for student id: {}", event.getStudentId());

        studentRepository.findById(event.getStudentId()).ifPresent(student -> {
            try {
                SmartAlertResponse alert = geminiService.generateSmartAlerts(student.getId());

                if (alert.isLowAttendanceRisk()) {
                    log.warn("Low attendance detected for student {}: {}%", student.getStudentCode(), alert.getAttendancePercentage());

                    // Notify student
                    notificationRepository.save(Notification.builder()
                            .recipient(student.getUser())
                            .title("Attendance Alert: Low Attendance Notice")
                            .message(String.format("Your attendance is currently %.1f%%, which is below the required 75%%. Please contact your academic advisor.", alert.getAttendancePercentage()))
                            .type(NotificationType.ATTENDANCE_ALERT)
                            .isRead(false)
                            .build());

                    // Notify parent if linked
                    if (student.getParent() != null && student.getParent().getUser() != null) {
                        notificationRepository.save(Notification.builder()
                                .recipient(student.getParent().getUser())
                                .title("Parent Alert: Low Attendance for " + student.getUser().getFullName())
                                .message(String.format("Attendance for your child %s is at %.1f%%. School policy requires at least 75%%.", student.getUser().getFullName(), alert.getAttendancePercentage()))
                                .type(NotificationType.ATTENDANCE_ALERT)
                                .isRead(false)
                                .build());
                    }
                }
            } catch (Exception e) {
                log.error("Error evaluating smart alerts during AttendanceMarkedEvent: {}", e.getMessage());
            }
        });
    }
}
