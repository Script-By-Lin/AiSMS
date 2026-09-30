package com.sms.app.repository;

import com.sms.app.entity.Invoice;
import com.sms.app.entity.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @EntityGraph(attributePaths = {"student", "student.user", "feeStructure", "feeStructure.course"})
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    @EntityGraph(attributePaths = {"student", "student.user", "feeStructure", "feeStructure.course"})
    List<Invoice> findByStudentId(Long studentId);

    @EntityGraph(attributePaths = {"student", "student.user", "feeStructure", "feeStructure.course"})
    Page<Invoice> findByStudentId(Long studentId, Pageable pageable);

    @EntityGraph(attributePaths = {"student", "student.user", "feeStructure", "feeStructure.course"})
    List<Invoice> findByStudentIdAndStatus(Long studentId, InvoiceStatus status);
}
