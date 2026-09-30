package com.sms.app.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherResponse {

    private Long id;
    private Long userId;
    private String employeeCode;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String specialization;
    private String qualification;
    private LocalDate hireDate;
    private List<CourseDto> assignedCourses;
}
