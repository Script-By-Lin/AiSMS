package com.sms.app.repository;

import com.sms.app.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientId(Long recipientId);
    Page<Notification> findByRecipientId(Long recipientId, Pageable pageable);
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId, Pageable pageable);
    List<Notification> findByRecipientIdAndIsReadFalse(Long recipientId);
    List<Notification> findTop5ByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId);
    long countByRecipientIdAndIsReadFalse(Long recipientId);
}
