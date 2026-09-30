package com.sms.app.dto;

import com.sms.app.entity.InvoiceStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse {

    private Long id;
    private String invoiceNumber;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private Long feeStructureId;
    private String feeTitle;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balanceAmount;
    private InvoiceStatus status;
    private LocalDate dueDate;
}
