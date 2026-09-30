package com.sms.app.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.math.BigDecimal;

@Getter
public class ExamResultPublishedEvent extends ApplicationEvent {

    private final Long resultId;
    private final Long examId;
    private final Long studentId;
    private final BigDecimal marksObtained;
    private final BigDecimal maxMarks;
    private final String grade;

    public ExamResultPublishedEvent(Object source, Long resultId, Long examId, Long studentId, BigDecimal marksObtained, BigDecimal maxMarks, String grade) {
        super(source);
        this.resultId = resultId;
        this.examId = examId;
        this.studentId = studentId;
        this.marksObtained = marksObtained;
        this.maxMarks = maxMarks;
        this.grade = grade;
    }
}
