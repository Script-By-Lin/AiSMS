package com.sms.app.dto;

import com.sms.app.entity.ComplaintSeverity;
import com.sms.app.entity.ComplaintStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintResponse {

    private Long id;
    private String title;
    private String description;
    private Long raisedById;
    private String raisedByName;
    private Long studentId;
    private String studentName;
    private ComplaintStatus status;
    private ComplaintSeverity severity;
    private String resolutionNotes;
    private LocalDateTime createdAt;
}
