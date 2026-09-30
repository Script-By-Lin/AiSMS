package com.sms.app.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.math.BigDecimal;

@Getter
public class PaymentCompletedEvent extends ApplicationEvent {

    private final Long paymentId;
    private final Long studentId;
    private final Long feeStructureId;
    private final Long invoiceId;
    private final BigDecimal amountPaid;
    private final String transactionReference;

    public PaymentCompletedEvent(Object source, Long paymentId, Long studentId, Long feeStructureId, Long invoiceId, BigDecimal amountPaid, String transactionReference) {
        super(source);
        this.paymentId = paymentId;
        this.studentId = studentId;
        this.feeStructureId = feeStructureId;
        this.invoiceId = invoiceId;
        this.amountPaid = amountPaid;
        this.transactionReference = transactionReference;
    }
}
