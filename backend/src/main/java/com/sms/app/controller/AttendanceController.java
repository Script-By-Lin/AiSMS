package com.sms.app.controller;

import com.sms.app.dto.*;
import com.sms.app.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<AttendanceResponse>> markAttendance(@Valid @RequestBody AttendanceMarkRequest request) {
        AttendanceResponse response = attendanceService.markAttendance(request);
        return ResponseEntity.ok(ApiResponse.ok("Attendance recorded", response));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<PageResponse<AttendanceResponse>>> getStudentAttendance(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageResponse<AttendanceResponse> response = attendanceService.getAttendanceByStudent(
                studentId,
                PageRequest.of(page, size, Sort.by("attendanceDate").descending())
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<ApiResponse<AttendanceSummaryDto>> getStudentAttendanceSummary(@PathVariable Long studentId) {
        AttendanceSummaryDto summary = attendanceService.getAttendanceSummary(studentId);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getCourseAttendance(
            @PathVariable Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<AttendanceResponse> list = attendanceService.getAttendanceByCourseAndDate(courseId, date);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
