package com.sms.app.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentResponse {

    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String occupation;
    private String relationship;
    private List<StudentResponse> children;
}
