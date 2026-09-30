package com.sms.app.dto;

import com.sms.app.entity.AttendanceStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponse {

    private Long id;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private Long courseId;
    private String courseName;
    private Long subjectId;
    private String subjectName;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
    private String remarks;
}
