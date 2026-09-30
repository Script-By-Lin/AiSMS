package com.sms.app.listener;

import com.sms.app.entity.Exam;
import com.sms.app.entity.Notification;
import com.sms.app.entity.NotificationType;
import com.sms.app.entity.Student;
import com.sms.app.event.ExamResultPublishedEvent;
import com.sms.app.repository.ExamRepository;
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
public class ExamResultEventListener {

    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;
    private final NotificationRepository notificationRepository;

    @Async("taskExecutor")
    @EventListener
    public void handleExamResultPublished(ExamResultPublishedEvent event) {
        log.info("Handling ExamResultPublishedEvent for result id: {}", event.getResultId());

        studentRepository.findById(event.getStudentId()).ifPresent(student -> {
            Exam exam = examRepository.findById(event.getExamId()).orElse(null);
            String examTitle = exam != null ? exam.getTitle() : "Exam";

            // Notify Student
            notificationRepository.save(Notification.builder()
                    .recipient(student.getUser())
                    .title("Exam Result Published: " + examTitle)
                    .message(String.format("Your result for %s has been published. Marks: %s/%s (Grade: %s)",
                            examTitle, event.getMarksObtained(), event.getMaxMarks(), event.getGrade()))
                    .type(NotificationType.EXAM_RESULT)
                    .isRead(false)
                    .build());

            // Notify Parent
            if (student.getParent() != null && student.getParent().getUser() != null) {
                notificationRepository.save(Notification.builder()
                        .recipient(student.getParent().getUser())
                        .title("Child Result Published: " + examTitle)
                        .message(String.format("Result for %s has been published for %s. Marks: %s/%s (Grade: %s)",
                                examTitle, student.getUser().getFullName(), event.getMarksObtained(), event.getMaxMarks(), event.getGrade()))
                        .type(NotificationType.EXAM_RESULT)
                        .isRead(false)
                        .build());
            }
        });
    }
}
