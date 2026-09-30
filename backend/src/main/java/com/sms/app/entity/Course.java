package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course extends BaseEntity {

    @Column(length = 50, unique = true, nullable = false)
    private String code;

    @Column(length = 150, nullable = false)
    private String name;

    @Column(length = 100)
    @Builder.Default
    private String category = "Artificial Intelligence & CS";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Integer credits = 3;

    @Column(name = "cash_down_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal cashDownFee = BigDecimal.valueOf(1200.00);

    @Column(name = "installment_months")
    @Builder.Default
    private Integer installmentMonths = 4;

    @Column(name = "monthly_installment", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal monthlyInstallment = BigDecimal.valueOf(250.00);

    @Column(name = "down_payment_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal downPaymentAmount = BigDecimal.valueOf(400.00);

    @Column(name = "foc_package", length = 255)
    @Builder.Default
    private String focPackage = "Official Academy T-Shirt, Course Textbooks & Workbooks, Student ID Card";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Subject> subjects = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Enrollment> enrollments = new ArrayList<>();
}
