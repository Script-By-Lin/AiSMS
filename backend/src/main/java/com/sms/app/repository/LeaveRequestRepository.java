package com.sms.app.repository;

import com.sms.app.entity.LeaveRequest;
import com.sms.app.entity.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    @EntityGraph(attributePaths = {"student", "student.user", "reviewedBy"})
    List<LeaveRequest> findByStudentId(Long studentId);

    @EntityGraph(attributePaths = {"student", "student.user", "reviewedBy"})
    List<LeaveRequest> findByStatus(LeaveStatus status);

    @EntityGraph(attributePaths = {"student", "student.user", "reviewedBy"})
    Page<LeaveRequest> findByIsDeletedFalse(Pageable pageable);
}
