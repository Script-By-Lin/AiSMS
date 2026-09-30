package com.sms.app.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDocumentDto {

    private Long id;
    private Long studentId;
    private String documentName;
    private String documentType;
    private String fileUrl;
    private LocalDateTime uploadedAt;
}
