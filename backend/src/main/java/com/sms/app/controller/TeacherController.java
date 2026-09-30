package com.sms.app.controller;

import com.sms.app.dto.*;
import com.sms.app.service.TeacherService;
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
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TeacherResponse>> createTeacher(@Valid @RequestBody TeacherCreateRequest request) {
        TeacherResponse response = teacherService.createTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Teacher created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherResponse>> getTeacherById(@PathVariable Long id) {
        TeacherResponse response = teacherService.getTeacherById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT_AFFAIR')")
    public ResponseEntity<ApiResponse<PageResponse<TeacherResponse>>> getAllTeachers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<TeacherResponse> response = teacherService.getAllTeachers(PageRequest.of(page, size, Sort.by("id").descending()));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{teacherId}/assign-course/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> assignCourse(@PathVariable Long teacherId, @PathVariable Long courseId) {
        teacherService.assignCourse(teacherId, courseId);
        return ResponseEntity.ok(ApiResponse.ok("Course assigned to teacher", null));
    }

    @GetMapping("/{teacherId}/courses")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getTeacherCourses(@PathVariable Long teacherId) {
        List<CourseDto> courses = teacherService.getAssignedCourses(teacherId);
        return ResponseEntity.ok(ApiResponse.ok(courses));
    }
}
