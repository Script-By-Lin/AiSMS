package com.sms.app.dto;

import com.sms.app.entity.LeadStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadCreateRequest {

    @NotBlank(message = "Lead full name is required")
    private String fullName;

    private String email;
    private String phone;
    private String interestedCourse;
    private LeadStatus status;
    private String source;
    private String notes;
    private Long assignedUserId;
}
