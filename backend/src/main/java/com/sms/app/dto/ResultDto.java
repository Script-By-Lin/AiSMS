package com.sms.app.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultDto {

    private Long id;
    private Long examId;
    private String examTitle;
    private String subjectName;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private BigDecimal marksObtained;
    private BigDecimal maxMarks;
    private String grade;
    private String remarks;
    private LocalDateTime publishedAt;
}
