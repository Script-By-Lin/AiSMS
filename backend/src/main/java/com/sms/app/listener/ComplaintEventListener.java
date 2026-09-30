package com.sms.app.listener;

import com.sms.app.entity.Notification;
import com.sms.app.entity.NotificationType;
import com.sms.app.entity.RoleType;
import com.sms.app.entity.User;
import com.sms.app.event.ComplaintRaisedEvent;
import com.sms.app.repository.NotificationRepository;
import com.sms.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ComplaintEventListener {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Async("taskExecutor")
    @EventListener
    public void handleComplaintRaised(ComplaintRaisedEvent event) {
        log.info("Handling ComplaintRaisedEvent: {}", event.getTitle());

        List<User> affairsOfficers = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> r.getName() == RoleType.ROLE_STUDENT_AFFAIR || r.getName() == RoleType.ROLE_ADMIN))
                .toList();

        for (User officer : affairsOfficers) {
            notificationRepository.save(Notification.builder()
                    .recipient(officer)
                    .title("Student Affair Alert: " + event.getTitle())
                    .message(String.format("A new complaint was submitted with %s severity. Please review in the Student Affairs portal.", event.getSeverity()))
                    .type(NotificationType.COMPLAINT_UPDATE)
                    .isRead(false)
                    .build());
        }
    }
}
