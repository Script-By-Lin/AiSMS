package com.sms.app.repository;

import com.sms.app.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @EntityGraph(attributePaths = {"teacher", "teacher.user"})
    Optional<Course> findByCode(String code);

    @EntityGraph(attributePaths = {"teacher", "teacher.user"})
    List<Course> findByTeacherId(Long teacherId);

    @EntityGraph(attributePaths = {"teacher", "teacher.user"})
    Page<Course> findByIsDeletedFalse(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"teacher", "teacher.user"})
    Optional<Course> findById(Long id);

    Boolean existsByCode(String code);
}
