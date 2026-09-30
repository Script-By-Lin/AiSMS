package com.sms.app.repository;

import com.sms.app.entity.Complaint;
import com.sms.app.entity.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    @EntityGraph(attributePaths = {"raisedBy", "student", "student.user"})
    List<Complaint> findByStatus(ComplaintStatus status);

    @EntityGraph(attributePaths = {"raisedBy", "student", "student.user"})
    List<Complaint> findByRaisedById(Long userId);

    @EntityGraph(attributePaths = {"raisedBy", "student", "student.user"})
    List<Complaint> findByStudentId(Long studentId);

    @EntityGraph(attributePaths = {"raisedBy", "student", "student.user"})
    Page<Complaint> findByIsDeletedFalse(Pageable pageable);
}
