package com.sms.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectDto {

    private Long id;

    @NotBlank(message = "Subject code is required")
    private String code;

    @NotBlank(message = "Subject name is required")
    private String name;

    @NotNull(message = "Course ID is required")
    private Long courseId;
    private String courseName;

    private Long teacherId;
    private String teacherName;
}
