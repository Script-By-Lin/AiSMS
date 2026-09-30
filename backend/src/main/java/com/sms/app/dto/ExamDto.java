package com.sms.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamDto {

    private Long id;

    @NotBlank(message = "Exam title is required")
    private String title;

    @NotNull(message = "Exam date is required")
    private LocalDate examDate;

    @NotNull(message = "Course ID is required")
    private Long courseId;
    private String courseName;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;
    private String subjectName;

    private BigDecimal maxMarks;
    private String term;
}
