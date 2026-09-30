package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "results",
        uniqueConstraints = @UniqueConstraint(columnNames = {"exam_id", "student_id"}),
        indexes = {
                @Index(name = "idx_results_student_id", columnList = "student_id"),
                @Index(name = "idx_results_exam_id", columnList = "exam_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "marks_obtained", precision = 5, scale = 2, nullable = false)
    private BigDecimal marksObtained;

    @Column(length = 10)
    private String grade;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}
