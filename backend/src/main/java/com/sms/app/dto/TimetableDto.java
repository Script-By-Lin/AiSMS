package com.sms.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableDto {

    private Long id;

    @NotNull(message = "Course ID is required")
    private Long courseId;
    private String courseName;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;
    private String subjectName;

    private Long teacherId;
    private String teacherName;

    @NotBlank(message = "Day of week is required")
    private String dayOfWeek;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    private String roomNumber;
}
