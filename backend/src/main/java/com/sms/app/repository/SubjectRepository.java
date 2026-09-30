package com.sms.app.repository;

import com.sms.app.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByCourseId(Long courseId);
    List<Subject> findByTeacherId(Long teacherId);
    Optional<Subject> findByCode(String code);
}
