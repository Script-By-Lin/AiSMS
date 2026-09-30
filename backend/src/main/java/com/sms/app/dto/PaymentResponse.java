package com.sms.app.dto;

import com.sms.app.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private Long feeStructureId;
    private String feeTitle;
    private Long invoiceId;
    private BigDecimal amountPaid;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String paymentPeriod;
    private String receiptNumber;
    private String focItems;
    private BigDecimal totalFee;
    private BigDecimal remainingBalance;
    private String salesAgentName;
    private String notes;
    private String transactionReference;
    private PaymentStatus status;
}
