package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "discipline_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisciplineRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "action_taken", columnDefinition = "TEXT")
    private String actionTaken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_id")
    private User reportedBy;
}
