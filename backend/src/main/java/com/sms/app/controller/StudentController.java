package com.sms.app.controller;

import com.sms.app.dto.*;
import com.sms.app.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES')")
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(@Valid @RequestBody StudentCreateRequest request) {
        StudentResponse response = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Student created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'SALES')")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(@PathVariable Long id, @RequestBody StudentUpdateRequest request) {
        StudentResponse response = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Student updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long id) {
        StudentResponse response = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/code/{studentCode}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentByCode(@PathVariable String studentCode) {
        StudentResponse response = studentService.getStudentByCode(studentCode);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'SALES', 'STUDENT_AFFAIR')")
    public ResponseEntity<ApiResponse<PageResponse<StudentResponse>>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageResponse<StudentResponse> response = studentService.getAllStudents(PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{studentId}/enroll/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT', 'SALES')")
    public ResponseEntity<ApiResponse<Void>> enrollInCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        studentService.enrollInCourse(studentId, courseId);
        return ResponseEntity.ok(ApiResponse.ok("Student enrolled in course successfully", null));
    }

    @PostMapping("/{studentId}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<ApiResponse<StudentDocumentDto>> uploadDocument(
            @PathVariable Long studentId,
            @RequestBody Map<String, String> body
    ) {
        String name = body.get("documentName");
        String type = body.get("documentType");
        String url = body.get("fileUrl");
        StudentDocumentDto dto = studentService.uploadDocument(studentId, name, type, url);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Document uploaded", dto));
    }

    @GetMapping("/{studentId}/documents")
    public ResponseEntity<ApiResponse<List<StudentDocumentDto>>> getDocuments(@PathVariable Long studentId) {
        List<StudentDocumentDto> docs = studentService.getStudentDocuments(studentId);
        return ResponseEntity.ok(ApiResponse.ok(docs));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.ok("Student deleted successfully", null));
    }
}
