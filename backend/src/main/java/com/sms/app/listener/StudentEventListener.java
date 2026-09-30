package com.sms.app.listener;

import com.sms.app.entity.Notification;
import com.sms.app.entity.NotificationType;
import com.sms.app.entity.User;
import com.sms.app.event.StudentCreatedEvent;
import com.sms.app.repository.NotificationRepository;
import com.sms.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StudentEventListener {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Async("taskExecutor")
    @EventListener
    public void handleStudentCreated(StudentCreatedEvent event) {
        log.info("Handling StudentCreatedEvent for student: {}", event.getStudentCode());

        userRepository.findById(event.getUserId()).ifPresent(user -> {
            notificationRepository.save(Notification.builder()
                    .recipient(user)
                    .title("Welcome to Student Management Portal!")
                    .message(String.format("Welcome, %s! Your official student identification code is %s. You can access course schedules, grades, attendance and AI tutoring.",
                            event.getFullName(), event.getStudentCode()))
                    .type(NotificationType.SYSTEM)
                    .isRead(false)
                    .build());
        });
    }
}
