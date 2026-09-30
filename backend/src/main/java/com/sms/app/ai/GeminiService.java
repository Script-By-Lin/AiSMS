package com.sms.app.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sms.app.dto.AiChatResponse;
import com.sms.app.dto.FeedbackResponse;
import com.sms.app.dto.PerformanceAnalysisResponse;
import com.sms.app.dto.SmartAlertResponse;
import com.sms.app.entity.*;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GeminiService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ResultRepository resultRepository;
    private final AiLogRepository aiLogRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${app.gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent}")
    private String geminiApiUrl;

    @Value("${app.gemini.model:gemini-3.8-flash}")
    private String geminiModel;

    @Cacheable(value = "ai_performance", key = "#studentId")
    public PerformanceAnalysisResponse analyzeStudentPerformance(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        long totalAttendance = attendanceRepository.countByStudentId(studentId);
        long presentAttendance = attendanceRepository.countPresentByStudentId(studentId);
        double attendanceRate = totalAttendance == 0 ? 100.0 : ((double) presentAttendance / totalAttendance) * 100.0;

        List<Result> results = resultRepository.findByStudentId(studentId);
        double avgMarks = results.stream()
                .map(Result::getMarksObtained)
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .orElse(0.0);

        List<String> weakSubjects = new ArrayList<>();
        List<String> strongSubjects = new ArrayList<>();
        StringBuilder gradesSummary = new StringBuilder();

        for (Result r : results) {
            String subName = r.getExam().getSubject().getName();
            double marks = r.getMarksObtained().doubleValue();
            gradesSummary.append("- ").append(subName).append(": ").append(marks).append("/").append(r.getExam().getMaxMarks()).append("\n");
            if (marks < 60.0) {
                weakSubjects.add(subName);
            } else if (marks >= 80.0) {
                strongSubjects.add(subName);
            }
        }

        String prompt = PromptTemplates.buildPerformanceAnalysisPrompt(
                student.getUser().getFullName(),
                student.getStudentCode(),
                attendanceRate,
                avgMarks,
                gradesSummary.toString()
        );

        String aiResponseText = callGemini(prompt);
        saveAiLog(student.getUser(), "PERFORMANCE_ANALYSIS", prompt, aiResponseText);

        String tier;
        if (avgMarks >= 85) tier = "EXCELLENT";
        else if (avgMarks >= 70) tier = "GOOD";
        else if (avgMarks >= 50) tier = "NEEDS_IMPROVEMENT";
        else tier = "CRITICAL";

        List<String> suggestions = new ArrayList<>();
        if (attendanceRate < 75.0) {
            suggestions.add("Prioritize regular classroom attendance; missed lectures directly correlate with low retention.");
        }
        if (!weakSubjects.isEmpty()) {
            suggestions.add("Schedule 1-on-1 tutoring or remedial assistance in: " + String.join(", ", weakSubjects));
        }
        suggestions.add("Establish a daily 45-minute revision routine with practice mock quizzes.");
        suggestions.add("Leverage teacher office hours to clear conceptual bottlenecks early.");

        String summary = StringUtils.hasText(aiResponseText) && !aiResponseText.startsWith("{")
                ? aiResponseText
                : String.format("%s demonstrates consistent learning capacity. Maintaining attendance at or above 85%% and focused study in weaker areas will elevate overall academic performance significantly.", student.getUser().getFullName());

        return PerformanceAnalysisResponse.builder()
                .studentId(studentId)
                .studentCode(student.getStudentCode())
                .studentName(student.getUser().getFullName())
                .currentGpa(Math.round((avgMarks / 20.0) * 100.0) / 100.0)
                .averageMarks(Math.round(avgMarks * 100.0) / 100.0)
                .attendanceRate(Math.round(attendanceRate * 10.0) / 10.0)
                .performanceTier(tier)
                .weakSubjects(weakSubjects)
                .strongSubjects(strongSubjects)
                .aiSuggestions(suggestions)
                .detailedSummary(summary)
                .build();
    }

    public AiChatResponse chat(String userMessage, Long userId, String role, Long contextualStudentId) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        String userName = user != null ? user.getFullName() : "User";

        StringBuilder context = new StringBuilder();
        if (contextualStudentId != null) {
            studentRepository.findById(contextualStudentId).ifPresent(s -> {
                context.append("Student Code: ").append(s.getStudentCode()).append("\n");
                context.append("Student Name: ").append(s.getUser().getFullName()).append("\n");
                long totalAtt = attendanceRepository.countByStudentId(contextualStudentId);
                long presAtt = attendanceRepository.countPresentByStudentId(contextualStudentId);
                double attRate = totalAtt == 0 ? 100.0 : ((double) presAtt / totalAtt) * 100.0;
                context.append("Current Attendance: ").append(String.format("%.1f%%", attRate)).append("\n");
            });
        }

        String prompt = PromptTemplates.buildChatbotPrompt(role, userName, context.toString(), userMessage);
        String reply = callGemini(prompt);

        if (!StringUtils.hasText(reply)) {
            reply = generateHeuristicChatReply(userMessage, role, userName);
        }

        saveAiLog(user, "CHATBOT", prompt, reply);

        return AiChatResponse.builder()
                .reply(reply)
                .model(StringUtils.hasText(geminiApiKey) ? geminiModel : "RuleEngine-Fallback")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Cacheable(value = "ai_alerts", key = "#studentId")
    public SmartAlertResponse generateSmartAlerts(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        long totalAttendance = attendanceRepository.countByStudentId(studentId);
        long presentAttendance = attendanceRepository.countPresentByStudentId(studentId);
        double attendanceRate = totalAttendance == 0 ? 100.0 : ((double) presentAttendance / totalAttendance) * 100.0;

        List<Result> results = resultRepository.findByStudentId(studentId);
        long failingCount = results.stream().filter(r -> r.getMarksObtained().doubleValue() < 50.0).count();
        double failingRate = results.isEmpty() ? 0.0 : ((double) failingCount / results.size()) * 100.0;

        boolean lowAttendance = attendanceRate < 75.0;
        boolean poorGrades = failingRate > 25.0;

        List<String> alerts = new ArrayList<>();
        if (lowAttendance) {
            alerts.add(String.format("Critical Attendance Warning: Attendance is at %.1f%%, below the mandatory 75%% threshold.", attendanceRate));
        }
        if (poorGrades) {
            alerts.add(String.format("Academic Warning: Student has failing or borderline grades in %d subjects.", failingCount));
        }
        if (alerts.isEmpty()) {
            alerts.add("Student is currently in good standing with satisfactory attendance and marks.");
        }

        String prompt = PromptTemplates.buildSmartAlertPrompt(student.getUser().getFullName(), attendanceRate, failingRate, String.join("; ", alerts));
        String aiActionPlan = callGemini(prompt);

        if (!StringUtils.hasText(aiActionPlan)) {
            aiActionPlan = lowAttendance || poorGrades
                    ? "Immediate parent-teacher conference recommended. Initiate 2-week monitored study hall sessions and weekly attendance verification."
                    : "No immediate intervention required. Maintain regular academic check-ins.";
        }

        saveAiLog(student.getUser(), "SMART_ALERT", prompt, aiActionPlan);

        return SmartAlertResponse.builder()
                .studentId(studentId)
                .studentName(student.getUser().getFullName())
                .studentCode(student.getStudentCode())
                .lowAttendanceRisk(lowAttendance)
                .attendancePercentage(Math.round(attendanceRate * 10.0) / 10.0)
                .poorGradesRisk(poorGrades)
                .failingGradesPercentage(Math.round(failingRate * 10.0) / 10.0)
                .activeAlerts(alerts)
                .aiActionPlan(aiActionPlan)
                .build();
    }

    @Cacheable(value = "ai_feedback", key = "#studentId")
    public FeedbackResponse generateFeedback(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        List<Result> results = resultRepository.findByStudentId(studentId);
        double avgMarks = results.stream()
                .map(Result::getMarksObtained)
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .orElse(0.0);

        long totalAttendance = attendanceRepository.countByStudentId(studentId);
        long presentAttendance = attendanceRepository.countPresentByStudentId(studentId);
        double attendanceRate = totalAttendance == 0 ? 100.0 : ((double) presentAttendance / totalAttendance) * 100.0;

        String prompt = PromptTemplates.buildFeedbackPrompt(student.getUser().getFullName(), avgMarks, attendanceRate, "Exam Results count: " + results.size());
        String aiFeedback = callGemini(prompt);

        if (!StringUtils.hasText(aiFeedback)) {
            aiFeedback = String.format("%s has maintained a commendable level of academic commitment this term with an average mark of %.1f%%. Continued diligence in class participation and analytical problem solving will ensure continued excellence.",
                    student.getUser().getFullName(), avgMarks);
        }

        List<String> strengths = List.of("Conceptual understanding in core courses", "Active engagement during classroom discussions");
        List<String> areas = List.of("Punctuality in assignment submissions", "Exam time management");

        saveAiLog(student.getUser(), "FEEDBACK_GENERATOR", prompt, aiFeedback);

        return FeedbackResponse.builder()
                .studentId(studentId)
                .studentName(student.getUser().getFullName())
                .studentCode(student.getStudentCode())
                .teacherFeedback("Solid academic performance throughout the semester.")
                .aiGeneratedFeedback(aiFeedback)
                .commendedStrengths(strengths)
                .targetedImprovementAreas(areas)
                .build();
    }

    private String callGemini(String prompt) {
        if (!StringUtils.hasText(geminiApiKey)) {
            log.info("Gemini API key is not configured; using heuristic AI fallback engine.");
            return "";
        }

        try {
            RestClient restClient = RestClient.create();
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    )
            );

            String url = geminiApiUrl + "?key=" + geminiApiKey;
            String response = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            if (StringUtils.hasText(response)) {
                JsonNode root = objectMapper.readTree(response);
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    return textNode.asText("");
                }
            }
        } catch (Exception e) {
            log.warn("Gemini API call failed or timed out: {}", e.getMessage());
        }

        return "";
    }

    private String generateHeuristicChatReply(String message, String role, String userName) {
        String msgLower = message.toLowerCase();
        if (msgLower.contains("attendance") || msgLower.contains("absent") || msgLower.contains("present")) {
            return String.format("Hello %s, you can view real-time attendance records in the Attendance section or Mobile Dashboard. If attendance falls below 75%%, early intervention alerts are automatically issued.", userName);
        } else if (msgLower.contains("result") || msgLower.contains("grade") || msgLower.contains("exam") || msgLower.contains("mark")) {
            return String.format("Academic results and exam schedules are updated continuously. You can check your subject breakdown, GPA, and AI performance analysis directly on the portal.", userName);
        } else if (msgLower.contains("fee") || msgLower.contains("pay") || msgLower.contains("invoice")) {
            return "Tuition and fee invoices can be reviewed under the Finance tab. Online payments can be completed securely with instant receipt generation.";
        } else if (msgLower.contains("complaint") || msgLower.contains("leave") || msgLower.contains("affair")) {
            return "Student Affairs handles complaints and leave requests with priority. Submissions are reviewed by school administrators promptly.";
        } else {
            return String.format("Hello %s! I'm your AI Educational Assistant for the Student Management System. How can I assist you with your academic schedule, attendance, grades, or administrative requests today?", userName);
        }
    }

    private void saveAiLog(User user, String feature, String prompt, String response) {
        try {
            AiLog logEntry = AiLog.builder()
                    .user(user)
                    .feature(feature)
                    .queryPrompt(prompt)
                    .aiResponse(response != null ? response : "")
                    .build();
            aiLogRepository.save(logEntry);
        } catch (Exception e) {
            log.error("Failed to save AI log: {}", e.getMessage());
        }
    }
}
