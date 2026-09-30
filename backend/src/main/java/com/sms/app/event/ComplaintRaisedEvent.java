package com.sms.app.event;

import com.sms.app.entity.ComplaintSeverity;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ComplaintRaisedEvent extends ApplicationEvent {

    private final Long complaintId;
    private final String title;
    private final Long raisedById;
    private final Long studentId;
    private final ComplaintSeverity severity;

    public ComplaintRaisedEvent(Object source, Long complaintId, String title, Long raisedById, Long studentId, ComplaintSeverity severity) {
        super(source);
        this.complaintId = complaintId;
        this.title = title;
        this.raisedById = raisedById;
        this.studentId = studentId;
        this.severity = severity;
    }
}
