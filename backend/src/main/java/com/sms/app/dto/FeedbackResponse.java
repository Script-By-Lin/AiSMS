package com.sms.app.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {

    private Long studentId;
    private String studentName;
    private String studentCode;
    private String teacherFeedback;
    private String aiGeneratedFeedback;
    private List<String> targetedImprovementAreas;
    private List<String> commendedStrengths;
}
