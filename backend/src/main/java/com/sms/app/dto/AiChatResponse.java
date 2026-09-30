package com.sms.app.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatResponse {

    private String reply;
    private String model;
    private LocalDateTime timestamp;
}
