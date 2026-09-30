package com.sms.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LinkChildRequest {

    @NotBlank(message = "Student code is required")
    private String studentCode;
}
