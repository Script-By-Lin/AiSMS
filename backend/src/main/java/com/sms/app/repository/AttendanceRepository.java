package com.sms.app.repository;

import com.sms.app.entity.Attendance;
import com.sms.app.entity.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    @EntityGraph(attributePaths = {"student", "student.user", "course", "subject"})
    List<Attendance> findByStudentId(Long studentId);

    @EntityGraph(attributePaths = {"student", "student.user", "course", "subject"})
    List<Attendance> findTop5ByStudentIdOrderByAttendanceDateDesc(Long studentId);

    @EntityGraph(attributePaths = {"student", "student.user", "course", "subject"})
    Page<Attendance> findByStudentId(Long studentId, Pageable pageable);

    @EntityGraph(attributePaths = {"student", "student.user", "course", "subject"})
    List<Attendance> findByCourseIdAndAttendanceDate(Long courseId, LocalDate date);

    Optional<Attendance> findByStudentIdAndAttendanceDateAndSubjectId(Long studentId, LocalDate date, Long subjectId);

    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    long countPresentByStudentId(@Param("studentId") Long studentId);
}
