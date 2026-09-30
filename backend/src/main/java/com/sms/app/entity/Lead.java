package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leads", indexes = {
        @Index(name = "idx_leads_status", columnList = "status"),
        @Index(name = "idx_leads_assigned_user_id", columnList = "assigned_user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead extends BaseEntity {

    @Column(name = "full_name", length = 150, nullable = false)
    private String fullName;

    @Column(length = 150)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(name = "interested_course", length = 150)
    private String interestedCourse;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    @Builder.Default
    private LeadStatus status = LeadStatus.NEW;

    @Column(length = 100)
    private String source;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;
}
