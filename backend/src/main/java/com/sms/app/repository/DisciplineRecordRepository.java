package com.sms.app.repository;

import com.sms.app.entity.DisciplineRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisciplineRecordRepository extends JpaRepository<DisciplineRecord, Long> {
    List<DisciplineRecord> findByStudentId(Long studentId);
}
