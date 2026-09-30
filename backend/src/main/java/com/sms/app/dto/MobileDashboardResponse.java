package com.sms.app.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MobileDashboardResponse {

    private String userRole;
    private String fullName;
    private String email;
    private Double attendancePercentage;
    private Double gpaOrAverageScore;
    private List<CourseDto> currentCourses;
    private List<AttendanceResponse> recentAttendance;
    private List<ResultDto> recentResults;
    private List<InvoiceResponse> pendingInvoices;
    private List<NotificationResponse> unreadNotifications;
    private List<String> aiInsights;
}
