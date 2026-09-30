package com.sms.app.controller;

import com.sms.app.dto.*;
import com.sms.app.service.FinanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @PostMapping("/fee-structures")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<ApiResponse<FeeStructureDto>> createFeeStructure(@Valid @RequestBody FeeStructureDto dto) {
        FeeStructureDto created = financeService.createFeeStructure(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Fee structure created", created));
    }

    @GetMapping("/fee-structures/course/{courseId}")
    public ResponseEntity<ApiResponse<List<FeeStructureDto>>> getFeeStructuresByCourse(@PathVariable Long courseId) {
        List<FeeStructureDto> list = financeService.getFeeStructuresByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/invoices/generate")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<ApiResponse<InvoiceResponse>> generateInvoice(
            @RequestParam Long studentId,
            @RequestParam Long feeStructureId
    ) {
        InvoiceResponse response = financeService.generateInvoice(studentId, feeStructureId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Invoice generated", response));
    }

    @GetMapping("/invoices/student/{studentId}")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoicesByStudent(@PathVariable Long studentId) {
        List<InvoiceResponse> list = financeService.getInvoicesByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/payments")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'PARENT', 'SALES')")
    public ResponseEntity<ApiResponse<PaymentResponse>> recordPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = financeService.recordPayment(request);
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", response));
    }

    @GetMapping("/payments/student/{studentId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByStudent(@PathVariable Long studentId) {
        List<PaymentResponse> list = financeService.getPaymentsByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/payments")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT_AFFAIR', 'SALES')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
        List<PaymentResponse> list = financeService.getAllPayments();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/invoices")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT_AFFAIR', 'SALES')")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getAllInvoices() {
        List<InvoiceResponse> list = financeService.getAllInvoices();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
