package com.sms.app.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceAnalysisResponse {

    private Long studentId;
    private String studentCode;
    private String studentName;
    private Double currentGpa;
    private Double averageMarks;
    private Double attendanceRate;
    private String performanceTier; // "EXCELLENT", "GOOD", "NEEDS_IMPROVEMENT", "CRITICAL"
    private List<String> weakSubjects;
    private List<String> strongSubjects;
    private List<String> aiSuggestions;
    private String detailedSummary;
}
