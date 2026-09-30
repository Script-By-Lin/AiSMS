package com.sms.app.controller;

import com.sms.app.dto.*;
import com.sms.app.entity.ComplaintStatus;
import com.sms.app.entity.LeaveStatus;
import com.sms.app.security.UserPrincipal;
import com.sms.app.service.StudentAffairService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/affairs")
@RequiredArgsConstructor
public class StudentAffairController {

    private final StudentAffairService studentAffairService;

    @PostMapping("/complaints")
    public ResponseEntity<ApiResponse<ComplaintResponse>> createComplaint(
            @Valid @RequestBody ComplaintCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        ComplaintResponse response = studentAffairService.createComplaint(request, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Complaint submitted", response));
    }

    @PutMapping("/complaints/{id}/resolve")
    @PreAuthorize("hasAnyRole('STUDENT_AFFAIR', 'ADMIN')")
    public ResponseEntity<ApiResponse<ComplaintResponse>> resolveComplaint(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        ComplaintStatus status = ComplaintStatus.valueOf(body.getOrDefault("status", "RESOLVED"));
        String notes = body.get("resolutionNotes");
        ComplaintResponse response = studentAffairService.resolveComplaint(id, status, notes);
        return ResponseEntity.ok(ApiResponse.ok("Complaint updated", response));
    }

    @GetMapping("/complaints")
    @PreAuthorize("hasAnyRole('STUDENT_AFFAIR', 'ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<ComplaintResponse>>> getAllComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<ComplaintResponse> response = studentAffairService.getAllComplaints(PageRequest.of(page, size, Sort.by("id").descending()));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/discipline")
    @PreAuthorize("hasAnyRole('STUDENT_AFFAIR', 'ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<DisciplineRecordDto>> recordDiscipline(
            @Valid @RequestBody DisciplineRecordDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        DisciplineRecordDto response = studentAffairService.recordDiscipline(dto, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Discipline record created", response));
    }

    @GetMapping("/discipline/student/{studentId}")
    public ResponseEntity<ApiResponse<List<DisciplineRecordDto>>> getDisciplineByStudent(@PathVariable Long studentId) {
        List<DisciplineRecordDto> list = studentAffairService.getDisciplineByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/leave")
    public ResponseEntity<ApiResponse<LeaveRequestDto>> applyForLeave(@Valid @RequestBody LeaveRequestDto dto) {
        LeaveRequestDto response = studentAffairService.applyForLeave(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Leave request submitted", response));
    }

    @PutMapping("/leave/{id}/status")
    @PreAuthorize("hasAnyRole('STUDENT_AFFAIR', 'ADMIN')")
    public ResponseEntity<ApiResponse<LeaveRequestDto>> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam LeaveStatus status,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        LeaveRequestDto response = studentAffairService.updateLeaveStatus(id, status, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Leave request updated", response));
    }

    @GetMapping("/leave/student/{studentId}")
    public ResponseEntity<ApiResponse<List<LeaveRequestDto>>> getLeavesByStudent(@PathVariable Long studentId) {
        List<LeaveRequestDto> list = studentAffairService.getLeavesByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/leave")
    @PreAuthorize("hasAnyRole('STUDENT_AFFAIR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaveRequestDto>>> getAllLeaveRequests() {
        List<LeaveRequestDto> list = studentAffairService.getAllLeaveRequests();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
