package com.sms.app.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentUpdateRequest {

    private String fullName;
    private String phoneNumber;
    private LocalDate dob;
    private String gender;
    private String address;
    private String emergencyContact;
    private Long parentId;
}
