package com.sms.app.repository;

import com.sms.app.entity.StudentDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentDocumentRepository extends JpaRepository<StudentDocument, Long> {
    List<StudentDocument> findByStudentId(Long studentId);
}
