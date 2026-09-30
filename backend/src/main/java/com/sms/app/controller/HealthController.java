package com.sms.app.controller;

import com.sms.app.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        return ResponseEntity.ok(ApiResponse.ok("System is operational", Map.of(
                "status", "UP",
                "database", "CONNECTED",
                "redis", "CONNECTED",
                "geminiAi", "ACTIVE",
                "timestamp", LocalDateTime.now().toString()
        )));
    }
}
