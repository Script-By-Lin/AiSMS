package com.sms.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatRequest {

    @NotBlank(message = "Message cannot be empty")
    private String message;

    private Long studentId; // optional contextual student ID for parents/teachers/students
}
