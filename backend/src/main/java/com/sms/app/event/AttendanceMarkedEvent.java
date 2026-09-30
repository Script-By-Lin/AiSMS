package com.sms.app.event;

import com.sms.app.entity.AttendanceStatus;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.time.LocalDate;

@Getter
public class AttendanceMarkedEvent extends ApplicationEvent {

    private final Long attendanceId;
    private final Long studentId;
    private final Long courseId;
    private final LocalDate attendanceDate;
    private final AttendanceStatus status;

    public AttendanceMarkedEvent(Object source, Long attendanceId, Long studentId, Long courseId, LocalDate attendanceDate, AttendanceStatus status) {
        super(source);
        this.attendanceId = attendanceId;
        this.studentId = studentId;
        this.courseId = courseId;
        this.attendanceDate = attendanceDate;
        this.status = status;
    }
}
