package com.sms.app.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long expiresIn;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles;
    private Long profileId; // studentId, teacherId, or parentId if applicable
}
