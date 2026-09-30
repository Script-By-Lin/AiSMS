package com.sms.app.dto;

import com.sms.app.entity.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private Long recipientId;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
