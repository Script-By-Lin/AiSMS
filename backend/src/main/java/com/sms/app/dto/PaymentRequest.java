package com.sms.app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Fee structure ID is required")
    private Long feeStructureId;

    private Long invoiceId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required")
    private String paymentMethod; // e.g. "CASH", "CARD", "BANK_TRANSFER", "KBZ_PAY", "WAVE_PAY"

    private String paymentPeriod; // e.g. "DOWN_PAYMENT", "MONTH_1", "MONTH_2", "CASH_DOWN"
    private LocalDateTime paymentDate;
    private String focItems;
    private String notes;
    private BigDecimal totalFee;
    private BigDecimal remainingBalance;
    private String salesAgentName;

    private String transactionReference;
}
