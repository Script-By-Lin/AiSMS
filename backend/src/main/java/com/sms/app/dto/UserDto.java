package com.sms.app.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Boolean active;
    private Set<String> roles;
}
