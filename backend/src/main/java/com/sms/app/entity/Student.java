package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students", indexes = {
        @Index(name = "idx_students_student_code", columnList = "student_code"),
        @Index(name = "idx_students_user_id", columnList = "user_id"),
        @Index(name = "idx_students_parent_id", columnList = "parent_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "student_code", length = 50, unique = true, nullable = false)
    private String studentCode;

    private LocalDate dob;

    @Column(length = 20)
    private String gender;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "emergency_contact", length = 50)
    private String emergencyContact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Parent parent;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Enrollment> enrollments = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Attendance> attendances = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Result> results = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @Builder.Default
    private List<StudentDocument> documents = new ArrayList<>();
}
