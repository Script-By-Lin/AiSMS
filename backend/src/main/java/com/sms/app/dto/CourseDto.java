package com.sms.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDto {

    private Long id;

    @NotBlank(message = "Course code is required")
    private String code;

    @NotBlank(message = "Course name is required")
    private String name;

    private String category;
    private String description;
    private Integer credits;
    private BigDecimal cashDownFee;
    private Integer installmentMonths;
    private BigDecimal monthlyInstallment;
    private BigDecimal downPaymentAmount;
    private String focPackage;

    private Long teacherId;
    private String teacherName;
    private List<SubjectDto> subjects;
    private Integer enrolledCount;
}
