package com.sms.app.repository;

import com.sms.app.entity.AiLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiLogRepository extends JpaRepository<AiLog, Long> {
    List<AiLog> findByUserId(Long userId);
    Page<AiLog> findByUserId(Long userId, Pageable pageable);
    List<AiLog> findByFeature(String feature);
}
