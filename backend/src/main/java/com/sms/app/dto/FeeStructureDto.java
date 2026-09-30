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
public class FeeStructureDto {

    private Long id;

    @NotNull(message = "Course ID is required")
    private Long courseId;
    private String courseName;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private String term;
    private String academicYear;
}
