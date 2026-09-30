package com.sms.app.ai;

public class PromptTemplates {

    public static String buildPerformanceAnalysisPrompt(String studentName, String studentCode,
                                                         double attendanceRate, double avgMarks,
                                                         String gradesSummary) {
        return """
            You are an expert academic advisor and AI educational psychologist in a Student Management System.
            Analyze the following student performance metrics:
            
            Student: %s (%s)
            Attendance Rate: %.1f%%
            Average Marks: %.1f / 100
            Course Performance Breakdown:
            %s
            
            Provide an in-depth evaluation in JSON format with keys:
            {
              "performanceTier": "EXCELLENT" | "GOOD" | "NEEDS_IMPROVEMENT" | "CRITICAL",
              "weakSubjects": ["subject1", ...],
              "strongSubjects": ["subject1", ...],
              "aiSuggestions": ["actionable advice 1", "actionable advice 2", ...],
              "detailedSummary": "A 2-3 sentence encouraging, holistic assessment for the student and parent."
            }
            Return ONLY valid JSON.
            """.formatted(studentName, studentCode, attendanceRate, avgMarks, gradesSummary);
    }

    public static String buildChatbotPrompt(String userRole, String userName, String contextInfo, String userMessage) {
        return """
            You are "SMS AI Assistant", an intelligent and empathetic educational chatbot integrated into the Student Management System.
            User Profile: %s (Role: %s)
            Relevant Academic Context:
            %s
            
            User's Inquiry: "%s"
            
            Answer clearly, politely, and helpfully. Keep answers concise, actionable, and supportive.
            """.formatted(userName, userRole, contextInfo, userMessage);
    }

    public static String buildSmartAlertPrompt(String studentName, double attendanceRate, double failingRate, String alertSummary) {
        return """
            You are an early intervention academic specialist. Evaluate the following risk indicators:
            Student: %s
            Attendance Rate: %.1f%% (Threshold: 75%%)
            Failing Courses Rate: %.1f%%
            Issues Flagged: %s
            
            Produce an early intervention action plan with immediate steps for school counselors, teachers, and parents.
            """.formatted(studentName, attendanceRate, failingRate, alertSummary);
    }

    public static String buildFeedbackPrompt(String studentName, double avgMarks, double attendanceRate, String courseDetails) {
        return """
            You are a master teacher generating term-end student report card feedback.
            Student: %s
            Average Score: %.1f / 100
            Attendance: %.1f%%
            Academic Details: %s
            
            Generate a personalized, constructive paragraph of feedback praising specific achievements and guiding areas needing focus.
            """.formatted(studentName, avgMarks, attendanceRate, courseDetails);
    }
}
