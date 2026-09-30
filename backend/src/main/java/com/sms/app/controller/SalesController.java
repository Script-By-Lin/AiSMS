package com.sms.app.controller;

import com.sms.app.dto.*;
import com.sms.app.entity.LeadStatus;
import com.sms.app.service.SalesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SALES', 'ADMIN')")
public class SalesController {

    private final SalesService salesService;

    @PostMapping("/leads")
    public ResponseEntity<ApiResponse<LeadResponse>> createLead(@Valid @RequestBody LeadCreateRequest request) {
        LeadResponse response = salesService.createLead(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Lead registered", response));
    }

    @PutMapping("/leads/{id}")
    public ResponseEntity<ApiResponse<LeadResponse>> updateLead(@PathVariable Long id, @RequestBody LeadUpdateRequest request) {
        LeadResponse response = salesService.updateLead(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Lead updated", response));
    }

    @GetMapping("/leads/{id}")
    public ResponseEntity<ApiResponse<LeadResponse>> getLeadById(@PathVariable Long id) {
        LeadResponse response = salesService.getLeadById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/leads")
    public ResponseEntity<ApiResponse<PageResponse<LeadResponse>>> getAllLeads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<LeadResponse> response = salesService.getAllLeads(PageRequest.of(page, size, Sort.by("id").descending()));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/leads/status/{status}")
    public ResponseEntity<ApiResponse<List<LeadResponse>>> getLeadsByStatus(@PathVariable LeadStatus status) {
        List<LeadResponse> list = salesService.getLeadsByStatus(status);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
