package com.sms.app.controller;

import com.sms.app.dto.*;
import com.sms.app.service.AcademicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/academic")
@RequiredArgsConstructor
public class AcademicController {

    private final AcademicService academicService;

    @PostMapping("/courses")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<ApiResponse<CourseDto>> createCourse(@Valid @RequestBody CourseDto dto) {
        CourseDto created = academicService.createCourse(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Course created", created));
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<CourseDto>> getCourseById(@PathVariable Long id) {
        CourseDto course = academicService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.ok(course));
    }

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<PageResponse<CourseDto>>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<CourseDto> response = academicService.getAllCourses(PageRequest.of(page, size, Sort.by("id").descending()));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/subjects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SubjectDto>> createSubject(@Valid @RequestBody SubjectDto dto) {
        SubjectDto created = academicService.createSubject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Subject created", created));
    }

    @GetMapping("/courses/{courseId}/subjects")
    public ResponseEntity<ApiResponse<List<SubjectDto>>> getSubjectsByCourse(@PathVariable Long courseId) {
        List<SubjectDto> subjects = academicService.getSubjectsByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.ok(subjects));
    }

    @PostMapping("/timetables")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<TimetableDto>> createTimetable(@Valid @RequestBody TimetableDto dto) {
        TimetableDto created = academicService.createTimetable(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Timetable schedule saved", created));
    }

    @GetMapping("/courses/{courseId}/timetables")
    public ResponseEntity<ApiResponse<List<TimetableDto>>> getTimetables(@PathVariable Long courseId) {
        List<TimetableDto> list = academicService.getTimetableByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/exams")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<ExamDto>> createExam(@Valid @RequestBody ExamDto dto) {
        ExamDto created = academicService.createExam(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Exam schedule created", created));
    }

    @GetMapping("/courses/{courseId}/exams")
    public ResponseEntity<ApiResponse<List<ExamDto>>> getExams(@PathVariable Long courseId) {
        List<ExamDto> list = academicService.getExamsByCourse(courseId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/results/publish")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<ResultDto>> publishResult(@Valid @RequestBody PublishResultRequest request) {
        ResultDto published = academicService.publishResult(request);
        return ResponseEntity.ok(ApiResponse.ok("Result published successfully", published));
    }

    @GetMapping("/exams/{examId}/results")
    public ResponseEntity<ApiResponse<List<ResultDto>>> getResultsByExam(@PathVariable Long examId) {
        List<ResultDto> list = academicService.getResultsByExam(examId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/students/{studentId}/results")
    public ResponseEntity<ApiResponse<List<ResultDto>>> getResultsByStudent(@PathVariable Long studentId) {
        List<ResultDto> list = academicService.getResultsByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/timetables")
    public ResponseEntity<ApiResponse<List<TimetableDto>>> getAllTimetables() {
        List<TimetableDto> list = academicService.getAllTimetables();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
