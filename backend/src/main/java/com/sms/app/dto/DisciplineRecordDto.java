package com.sms.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisciplineRecordDto {

    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;
    private String studentName;
    private String studentCode;

    @NotNull(message = "Incident date is required")
    private LocalDate incidentDate;

    @NotBlank(message = "Description is required")
    private String description;

    private String actionTaken;
    private Long reportedById;
    private String reportedByName;
}
