package com.sms.app.controller;

import com.sms.app.dto.*;
import com.sms.app.service.ParentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/parents")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<ApiResponse<ParentResponse>> createParent(@Valid @RequestBody ParentCreateRequest request) {
        ParentResponse response = parentService.createParent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Parent registered", response));
    }

    @PostMapping("/{parentId}/link-child")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARENT', 'SALES')")
    public ResponseEntity<ApiResponse<Void>> linkChild(
            @PathVariable Long parentId,
            @Valid @RequestBody LinkChildRequest request
    ) {
        parentService.linkChild(parentId, request.getStudentCode());
        return ResponseEntity.ok(ApiResponse.ok("Child linked to parent profile", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ParentResponse>> getParentById(@PathVariable Long id) {
        ParentResponse response = parentService.getParentById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<ParentResponse>> getParentByUserId(@PathVariable Long userId) {
        ParentResponse response = parentService.getParentByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{parentId}/child/{studentId}/attendance")
    @PreAuthorize("hasAnyRole('PARENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getChildAttendance(
            @PathVariable Long parentId,
            @PathVariable Long studentId
    ) {
        List<AttendanceResponse> list = parentService.getChildAttendance(parentId, studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{parentId}/child/{studentId}/results")
    @PreAuthorize("hasAnyRole('PARENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ResultDto>>> getChildResults(
            @PathVariable Long parentId,
            @PathVariable Long studentId
    ) {
        List<ResultDto> list = parentService.getChildResults(parentId, studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{parentId}/child/{studentId}/fees")
    @PreAuthorize("hasAnyRole('PARENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getChildFees(
            @PathVariable Long parentId,
            @PathVariable Long studentId
    ) {
        List<InvoiceResponse> list = parentService.getChildInvoices(parentId, studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
