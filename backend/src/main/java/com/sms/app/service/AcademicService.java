package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.event.ExamResultPublishedEvent;
import com.sms.app.exception.BadRequestException;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicService {

    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final TimetableRepository timetableRepository;
    private final ExamRepository examRepository;
    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final EntityMapper mapper;

    @Transactional
    public CourseDto createCourse(CourseDto dto) {
        if (courseRepository.existsByCode(dto.getCode())) {
            throw new BadRequestException("Course code already exists: " + dto.getCode());
        }

        Teacher teacher = null;
        if (dto.getTeacherId() != null) {
            teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + dto.getTeacherId()));
        }

        Course course = Course.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .category(dto.getCategory() != null ? dto.getCategory() : "Artificial Intelligence & CS")
                .description(dto.getDescription())
                .credits(dto.getCredits() != null ? dto.getCredits() : 3)
                .cashDownFee(dto.getCashDownFee())
                .installmentMonths(dto.getInstallmentMonths() != null ? dto.getInstallmentMonths() : 4)
                .monthlyInstallment(dto.getMonthlyInstallment())
                .downPaymentAmount(dto.getDownPaymentAmount())
                .focPackage(dto.getFocPackage())
                .teacher(teacher)
                .build();
        course = courseRepository.save(course);
        return mapper.toCourseDto(course);
    }

    @Transactional(readOnly = true)
    public CourseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return mapper.toCourseDto(course);
    }

    @Transactional(readOnly = true)
    public PageResponse<CourseDto> getAllCourses(Pageable pageable) {
        Page<Course> page = courseRepository.findByIsDeletedFalse(pageable);
        List<CourseDto> content = page.getContent().stream()
                .map(mapper::toCourseDto)
                .collect(Collectors.toList());

        return PageResponse.<CourseDto>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional
    public SubjectDto createSubject(SubjectDto dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + dto.getCourseId()));

        Teacher teacher = null;
        if (dto.getTeacherId() != null) {
            teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + dto.getTeacherId()));
        }

        Subject subject = Subject.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .course(course)
                .teacher(teacher)
                .build();
        subject = subjectRepository.save(subject);
        return mapper.toSubjectDto(subject);
    }

    @Transactional(readOnly = true)
    public List<SubjectDto> getSubjectsByCourse(Long courseId) {
        return subjectRepository.findByCourseId(courseId).stream()
                .map(mapper::toSubjectDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TimetableDto createTimetable(TimetableDto dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + dto.getCourseId()));
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + dto.getSubjectId()));

        Teacher teacher = null;
        if (dto.getTeacherId() != null) {
            teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found: " + dto.getTeacherId()));
        }

        Timetable timetable = Timetable.builder()
                .course(course)
                .subject(subject)
                .teacher(teacher)
                .dayOfWeek(dto.getDayOfWeek())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .roomNumber(dto.getRoomNumber())
                .build();
        timetable = timetableRepository.save(timetable);
        return mapper.toTimetableDto(timetable);
    }

    @Transactional(readOnly = true)
    public List<TimetableDto> getTimetableByCourse(Long courseId) {
        return timetableRepository.findByCourseId(courseId).stream()
                .map(mapper::toTimetableDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ExamDto createExam(ExamDto dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + dto.getCourseId()));
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + dto.getSubjectId()));

        Exam exam = Exam.builder()
                .title(dto.getTitle())
                .examDate(dto.getExamDate())
                .course(course)
                .subject(subject)
                .maxMarks(dto.getMaxMarks() != null ? dto.getMaxMarks() : BigDecimal.valueOf(100.00))
                .term(dto.getTerm())
                .build();
        exam = examRepository.save(exam);
        return mapper.toExamDto(exam);
    }

    @Transactional(readOnly = true)
    public List<ExamDto> getExamsByCourse(Long courseId) {
        return examRepository.findByCourseId(courseId).stream()
                .map(mapper::toExamDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResultDto publishResult(PublishResultRequest request) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + request.getExamId()));
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        String grade = request.getGrade();
        if (grade == null || grade.trim().isEmpty()) {
            double percentage = (request.getMarksObtained().doubleValue() / exam.getMaxMarks().doubleValue()) * 100.0;
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 50) grade = "D";
            else grade = "F";
        }

        Result result = resultRepository.findByExamIdAndStudentId(request.getExamId(), request.getStudentId())
                .orElse(Result.builder()
                        .exam(exam)
                        .student(student)
                        .build());

        result.setMarksObtained(request.getMarksObtained());
        result.setGrade(grade);
        result.setRemarks(request.getRemarks());
        result.setPublishedAt(LocalDateTime.now());
        result = resultRepository.save(result);

        eventPublisher.publishEvent(new ExamResultPublishedEvent(
                this,
                result.getId(),
                exam.getId(),
                student.getId(),
                result.getMarksObtained(),
                exam.getMaxMarks(),
                result.getGrade()
        ));

        return mapper.toResultDto(result);
    }

    @Transactional(readOnly = true)
    public List<ResultDto> getResultsByExam(Long examId) {
        return resultRepository.findByExamId(examId).stream()
                .map(mapper::toResultDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResultDto> getResultsByStudent(Long studentId) {
        return resultRepository.findByStudentId(studentId).stream()
                .map(mapper::toResultDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TimetableDto> getAllTimetables() {
        return timetableRepository.findAll().stream()
                .map(mapper::toTimetableDto)
                .collect(Collectors.toList());
    }
}
