package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payments_student_id", columnList = "student_id"),
        @Index(name = "idx_payments_transaction_reference", columnList = "transaction_reference")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fee_structure_id", nullable = false)
    private FeeStructure feeStructure;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    @Column(name = "amount_paid", precision = 10, scale = 2, nullable = false)
    private BigDecimal amountPaid;

    @Column(name = "payment_date", nullable = false)
    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(name = "payment_method", length = 50, nullable = false)
    private String paymentMethod;

    @Column(name = "payment_period", length = 100)
    @Builder.Default
    private String paymentPeriod = "DOWN_PAYMENT";

    @Column(name = "receipt_number", length = 100)
    private String receiptNumber;

    @Column(name = "foc_items", length = 500)
    private String focItems;

    @Column(name = "total_fee", precision = 10, scale = 2)
    private BigDecimal totalFee;

    @Column(name = "remaining_balance", precision = 10, scale = 2)
    private BigDecimal remainingBalance;

    @Column(name = "sales_agent_name", length = 150)
    private String salesAgentName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "transaction_reference", length = 150, unique = true)
    private String transactionReference;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.COMPLETED;
}
