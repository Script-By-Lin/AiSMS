package com.sms.app.dto;

import com.sms.app.entity.LeadStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadUpdateRequest {

    private String fullName;
    private String email;
    private String phone;
    private String interestedCourse;
    private LeadStatus status;
    private String source;
    private String notes;
    private Long assignedUserId;
}
