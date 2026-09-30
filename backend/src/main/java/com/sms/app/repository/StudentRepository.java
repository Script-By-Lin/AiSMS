package com.sms.app.repository;

import com.sms.app.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {

    @EntityGraph(attributePaths = {"user", "parent", "parent.user"})
    Optional<Student> findByStudentCode(String studentCode);

    @EntityGraph(attributePaths = {"user", "parent", "parent.user"})
    Optional<Student> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user", "parent", "parent.user"})
    List<Student> findByParentId(Long parentId);

    @EntityGraph(attributePaths = {"user", "parent", "parent.user"})
    Page<Student> findByIsDeletedFalse(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"user", "parent", "parent.user"})
    Optional<Student> findById(Long id);

    Boolean existsByStudentCode(String studentCode);
}
