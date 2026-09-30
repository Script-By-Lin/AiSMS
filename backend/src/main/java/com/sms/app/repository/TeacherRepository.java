package com.sms.app.repository;

import com.sms.app.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    @EntityGraph(attributePaths = {"user"})
    Optional<Teacher> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user"})
    Optional<Teacher> findByEmployeeCode(String employeeCode);

    @Override
    @EntityGraph(attributePaths = {"user"})
    Optional<Teacher> findById(Long id);

    @Override
    @EntityGraph(attributePaths = {"user"})
    Page<Teacher> findAll(Pageable pageable);

    Boolean existsByEmployeeCode(String employeeCode);
}
