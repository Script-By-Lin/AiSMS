package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.event.PaymentCompletedEvent;
import com.sms.app.exception.BadRequestException;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final FeeStructureRepository feeStructureRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final EntityMapper mapper;

    @Transactional
    public FeeStructureDto createFeeStructure(FeeStructureDto dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + dto.getCourseId()));

        FeeStructure feeStructure = FeeStructure.builder()
                .course(course)
                .title(dto.getTitle())
                .amount(dto.getAmount())
                .dueDate(dto.getDueDate())
                .term(dto.getTerm())
                .academicYear(dto.getAcademicYear())
                .build();
        feeStructure = feeStructureRepository.save(feeStructure);
        return mapper.toFeeStructureDto(feeStructure);
    }

    @Transactional(readOnly = true)
    public List<FeeStructureDto> getFeeStructuresByCourse(Long courseId) {
        return feeStructureRepository.findByCourseId(courseId).stream()
                .map(mapper::toFeeStructureDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InvoiceResponse generateInvoice(Long studentId, Long feeStructureId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        FeeStructure feeStructure = feeStructureRepository.findById(feeStructureId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found with id: " + feeStructureId));

        String invoiceNumber = "INV-" + System.currentTimeMillis();
        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .student(student)
                .feeStructure(feeStructure)
                .totalAmount(feeStructure.getAmount())
                .paidAmount(BigDecimal.ZERO)
                .balanceAmount(feeStructure.getAmount())
                .status(InvoiceStatus.UNPAID)
                .dueDate(feeStructure.getDueDate())
                .build();
        invoice = invoiceRepository.save(invoice);
        return mapper.toInvoiceResponse(invoice);
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByStudent(Long studentId) {
        return invoiceRepository.findByStudentId(studentId).stream()
                .map(mapper::toInvoiceResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse recordPayment(PaymentRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));
        FeeStructure feeStructure = feeStructureRepository.findById(request.getFeeStructureId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found with id: " + request.getFeeStructureId()));

        Invoice invoice = null;
        if (request.getInvoiceId() != null) {
            invoice = invoiceRepository.findById(request.getInvoiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + request.getInvoiceId()));
        }

        String txRef = request.getTransactionReference();
        if (txRef == null || txRef.trim().isEmpty()) {
            txRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        String receiptNo = "REC-2026-" + (System.currentTimeMillis() % 100000);

        Payment payment = Payment.builder()
                .student(student)
                .feeStructure(feeStructure)
                .invoice(invoice)
                .amountPaid(request.getAmount())
                .paymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDateTime.now())
                .paymentMethod(request.getPaymentMethod())
                .paymentPeriod(request.getPaymentPeriod() != null ? request.getPaymentPeriod() : "DOWN_PAYMENT")
                .receiptNumber(receiptNo)
                .focItems(request.getFocItems())
                .totalFee(request.getTotalFee() != null ? request.getTotalFee() : feeStructure.getAmount())
                .remainingBalance(request.getRemainingBalance())
                .salesAgentName(request.getSalesAgentName() != null ? request.getSalesAgentName() : "Sales Officer")
                .notes(request.getNotes())
                .transactionReference(txRef)
                .status(PaymentStatus.COMPLETED)
                .build();
        payment = paymentRepository.save(payment);

        eventPublisher.publishEvent(new PaymentCompletedEvent(
                this,
                payment.getId(),
                student.getId(),
                feeStructure.getId(),
                invoice != null ? invoice.getId() : null,
                payment.getAmountPaid(),
                payment.getTransactionReference()
        ));

        return mapper.toPaymentResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByStudent(Long studentId) {
        return paymentRepository.findByStudentId(studentId).stream()
                .map(mapper::toPaymentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(mapper::toPaymentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(mapper::toInvoiceResponse)
                .collect(Collectors.toList());
    }
}
