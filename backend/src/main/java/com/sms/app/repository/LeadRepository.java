package com.sms.app.repository;

import com.sms.app.entity.Lead;
import com.sms.app.entity.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    @EntityGraph(attributePaths = {"assignedUser"})
    List<Lead> findByStatus(LeadStatus status);

    @EntityGraph(attributePaths = {"assignedUser"})
    Page<Lead> findByIsDeletedFalse(Pageable pageable);

    @EntityGraph(attributePaths = {"assignedUser"})
    List<Lead> findByAssignedUserId(Long userId);

    @Override
    @EntityGraph(attributePaths = {"assignedUser"})
    Optional<Lead> findById(Long id);
}
