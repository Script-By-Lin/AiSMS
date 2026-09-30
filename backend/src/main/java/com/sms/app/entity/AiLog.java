package com.sms.app.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 100, nullable = false)
    private String feature;

    @Column(name = "query_prompt", columnDefinition = "TEXT", nullable = false)
    private String queryPrompt;

    @Column(name = "ai_response", columnDefinition = "TEXT", nullable = false)
    private String aiResponse;
}
