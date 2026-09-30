package com.sms.app.controller;

import com.sms.app.ai.GeminiService;
import com.sms.app.dto.*;
import com.sms.app.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final GeminiService geminiService;

    @GetMapping("/performance/{studentId}")
    public ResponseEntity<ApiResponse<PerformanceAnalysisResponse>> analyzePerformance(@PathVariable Long studentId) {
        PerformanceAnalysisResponse response = geminiService.analyzeStudentPerformance(studentId);
        return ResponseEntity.ok(ApiResponse.ok("AI Performance Analysis generated", response));
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            @Valid @RequestBody AiChatRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        String role = userPrincipal.getAuthorities().isEmpty()
                ? "STUDENT"
                : userPrincipal.getAuthorities().iterator().next().getAuthority();

        AiChatResponse response = geminiService.chat(
                request.getMessage(),
                userPrincipal.getId(),
                role,
                request.getStudentId()
        );
        return ResponseEntity.ok(ApiResponse.ok("AI Response generated", response));
    }

    @GetMapping("/smart-alerts/{studentId}")
    public ResponseEntity<ApiResponse<SmartAlertResponse>> getSmartAlerts(@PathVariable Long studentId) {
        SmartAlertResponse response = geminiService.generateSmartAlerts(studentId);
        return ResponseEntity.ok(ApiResponse.ok("AI Smart Alerts evaluated", response));
    }

    @GetMapping("/feedback/{studentId}")
    public ResponseEntity<ApiResponse<FeedbackResponse>> generateFeedback(@PathVariable Long studentId) {
        FeedbackResponse response = geminiService.generateFeedback(studentId);
        return ResponseEntity.ok(ApiResponse.ok("AI Report Card Feedback generated", response));
    }
}
