package com.sms.app.dto;

import com.sms.app.entity.ComplaintSeverity;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Long studentId;
    private ComplaintSeverity severity;
}
