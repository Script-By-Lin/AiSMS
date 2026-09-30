package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "attendance",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "attendance_date", "subject_id"}),
        indexes = {
                @Index(name = "idx_attendance_student_id", columnList = "student_id"),
                @Index(name = "idx_attendance_course_id", columnList = "course_id"),
                @Index(name = "idx_attendance_date", columnList = "attendance_date")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private AttendanceStatus status;

    @Column(length = 255)
    private String remarks;
}
