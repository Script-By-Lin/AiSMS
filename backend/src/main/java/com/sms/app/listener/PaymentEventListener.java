package com.sms.app.listener;

import com.sms.app.entity.Invoice;
import com.sms.app.entity.InvoiceStatus;
import com.sms.app.entity.Notification;
import com.sms.app.entity.NotificationType;
import com.sms.app.entity.Student;
import com.sms.app.event.PaymentCompletedEvent;
import com.sms.app.repository.InvoiceRepository;
import com.sms.app.repository.NotificationRepository;
import com.sms.app.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventListener {

    private final StudentRepository studentRepository;
    private final InvoiceRepository invoiceRepository;
    private final NotificationRepository notificationRepository;

    @Async("taskExecutor")
    @EventListener
    @Transactional
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        log.info("Handling PaymentCompletedEvent for payment id: {}", event.getPaymentId());

        if (event.getInvoiceId() != null) {
            invoiceRepository.findById(event.getInvoiceId()).ifPresent(invoice -> {
                BigDecimal newPaid = invoice.getPaidAmount().add(event.getAmountPaid());
                BigDecimal newBalance = invoice.getTotalAmount().subtract(newPaid);
                invoice.setPaidAmount(newPaid);
                invoice.setBalanceAmount(newBalance.max(BigDecimal.ZERO));
                if (newBalance.compareTo(BigDecimal.ZERO) <= 0) {
                    invoice.setStatus(InvoiceStatus.PAID);
                } else {
                    invoice.setStatus(InvoiceStatus.PARTIAL);
                }
                invoiceRepository.save(invoice);
            });
        }

        studentRepository.findById(event.getStudentId()).ifPresent(student -> {
            // Receipt notification to student
            notificationRepository.save(Notification.builder()
                    .recipient(student.getUser())
                    .title("Payment Received")
                    .message(String.format("Payment of $%s has been successfully recorded. Transaction reference: %s",
                            event.getAmountPaid(), event.getTransactionReference()))
                    .type(NotificationType.PAYMENT_RECEIPT)
                    .isRead(false)
                    .build());

            // Receipt notification to parent
            if (student.getParent() != null && student.getParent().getUser() != null) {
                notificationRepository.save(Notification.builder()
                        .recipient(student.getParent().getUser())
                        .title("Fee Payment Received for " + student.getUser().getFullName())
                        .message(String.format("Payment of $%s has been successfully processed for %s (Ref: %s)",
                                event.getAmountPaid(), student.getUser().getFullName(), event.getTransactionReference()))
                        .type(NotificationType.PAYMENT_RECEIPT)
                        .isRead(false)
                        .build());
            }
        });
    }
}
