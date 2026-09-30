package com.sms.app.controller;

import com.sms.app.dto.*;
import com.sms.app.entity.Student;
import com.sms.app.repository.StudentRepository;
import com.sms.app.security.UserPrincipal;
import com.sms.app.service.AttendanceService;
import com.sms.app.service.MobileService;
import com.sms.app.service.NotificationService;
import com.sms.app.service.AcademicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mobile")
@RequiredArgsConstructor
public class MobileController {

    private final MobileService mobileService;
    private final AttendanceService attendanceService;
    private final AcademicService academicService;
    private final NotificationService notificationService;
    private final StudentRepository studentRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<MobileDashboardResponse>> getMobileDashboard(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        MobileDashboardResponse dashboard = mobileService.getDashboard(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Mobile dashboard retrieved", dashboard));
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<AttendanceSummaryDto>> getMobileAttendance(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Student student = studentRepository.findByUserId(userPrincipal.getId()).orElse(null);
        if (student == null) {
            return ResponseEntity.ok(ApiResponse.ok("No student profile linked", null));
        }
        AttendanceSummaryDto summary = attendanceService.getAttendanceSummary(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<ResultDto>>> getMobileResults(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Student student = studentRepository.findByUserId(userPrincipal.getId()).orElse(null);
        if (student == null) {
            return ResponseEntity.ok(ApiResponse.ok("No student profile linked", Collections.emptyList()));
        }
        List<ResultDto> results = academicService.getResultsByStudent(student.getId());
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMobileNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        List<NotificationResponse> list = notificationService.getUnreadNotifications(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
