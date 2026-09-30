package com.sms.app.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceSummaryDto {

    private Long studentId;
    private String studentCode;
    private String studentName;
    private long totalClasses;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private long excusedCount;
    private double percentage;
    private boolean lowAttendanceAlert; // true if < 75%
}
