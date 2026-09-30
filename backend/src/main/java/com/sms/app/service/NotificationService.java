package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getNotificationsForUser(Long userId, Pageable pageable) {
        Page<Notification> page = notificationRepository.findByRecipientId(userId, pageable);
        List<NotificationResponse> content = page.getContent().stream()
                .map(mapper::toNotificationResponse)
                .collect(Collectors.toList());

        return PageResponse.<NotificationResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalse(userId).stream()
                .map(mapper::toNotificationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalse(userId);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public NotificationResponse sendNotification(SendNotificationRequest request) {
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with id: " + request.getRecipientId()));

        Notification notification = Notification.builder()
                .recipient(recipient)
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType() != null ? request.getType() : NotificationType.SYSTEM)
                .isRead(false)
                .build();
        notification = notificationRepository.save(notification);
        return mapper.toNotificationResponse(notification);
    }
}
