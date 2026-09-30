package com.sms.app.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class StudentCreatedEvent extends ApplicationEvent {

    private final Long studentId;
    private final String studentCode;
    private final Long userId;
    private final String fullName;

    public StudentCreatedEvent(Object source, Long studentId, String studentCode, Long userId, String fullName) {
        super(source);
        this.studentId = studentId;
        this.studentCode = studentCode;
        this.userId = userId;
        this.fullName = fullName;
    }
}
