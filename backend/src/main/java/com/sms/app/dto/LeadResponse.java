package com.sms.app.dto;

import com.sms.app.entity.LeadStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String interestedCourse;
    private LeadStatus status;
    private String source;
    private String notes;
    private Long assignedUserId;
    private String assignedUserName;
    private LocalDateTime createdAt;
}
