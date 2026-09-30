package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "employee_code", length = 50, unique = true, nullable = false)
    private String employeeCode;

    @Column(length = 150)
    private String specialization;

    @Column(length = 150)
    private String qualification;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @OneToMany(mappedBy = "teacher")
    @Builder.Default
    private List<Course> courses = new ArrayList<>();
}
