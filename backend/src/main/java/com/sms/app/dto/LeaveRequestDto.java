package com.sms.app.dto;

import com.sms.app.entity.LeaveStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequestDto {

    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;
    private String studentName;
    private String studentCode;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotBlank(message = "Reason is required")
    private String reason;

    private LeaveStatus status;
    private Long reviewedById;
    private String reviewedByName;
}
