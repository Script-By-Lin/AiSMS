package com.sms.app.repository;

import com.sms.app.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudentId(Long studentId);
    Page<Payment> findByStudentId(Long studentId, Pageable pageable);
    Optional<Payment> findByTransactionReference(String transactionReference);
}
