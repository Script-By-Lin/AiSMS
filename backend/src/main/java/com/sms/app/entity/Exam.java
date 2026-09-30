package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exam extends BaseEntity {

    @Column(length = 150, nullable = false)
    private String title;

    @Column(name = "exam_date", nullable = false)
    private LocalDate examDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "max_marks", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal maxMarks = BigDecimal.valueOf(100.00);

    @Column(length = 50)
    private String term;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Result> results = new ArrayList<>();
}
