package com.sms.app.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmartAlertResponse {

    private Long studentId;
    private String studentName;
    private String studentCode;
    private boolean lowAttendanceRisk;
    private Double attendancePercentage;
    private boolean poorGradesRisk;
    private Double failingGradesPercentage;
    private List<String> activeAlerts;
    private String aiActionPlan;
}
