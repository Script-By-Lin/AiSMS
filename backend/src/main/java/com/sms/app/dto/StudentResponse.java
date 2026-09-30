package com.sms.app.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {

    private Long id;
    private Long userId;
    private String studentCode;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private LocalDate dob;
    private String gender;
    private String address;
    private String emergencyContact;
    private Long parentId;
    private String parentName;
    private List<CourseDto> enrolledCourses;
    private Double attendancePercentage;
    private Double averageMarks;
}
