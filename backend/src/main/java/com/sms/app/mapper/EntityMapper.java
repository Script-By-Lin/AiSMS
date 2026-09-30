package com.sms.app.mapper;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public UserDto toUserDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .active(user.getActive())
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
                .build();
    }

    public StudentResponse toStudentResponse(Student student) {
        if (student == null) return null;
        List<CourseDto> courses = student.getEnrollments() != null
                ? student.getEnrollments().stream()
                .map(Enrollment::getCourse)
                .map(this::toCourseDto)
                .collect(Collectors.toList())
                : Collections.emptyList();

        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .studentCode(student.getStudentCode())
                .username(student.getUser().getUsername())
                .email(student.getUser().getEmail())
                .fullName(student.getUser().getFullName())
                .phoneNumber(student.getUser().getPhoneNumber())
                .dob(student.getDob())
                .gender(student.getGender())
                .address(student.getAddress())
                .emergencyContact(student.getEmergencyContact())
                .parentId(student.getParent() != null ? student.getParent().getId() : null)
                .parentName(student.getParent() != null && student.getParent().getUser() != null ? student.getParent().getUser().getFullName() : null)
                .enrolledCourses(courses)
                .build();
    }

    public ParentResponse toParentResponse(Parent parent) {
        if (parent == null) return null;
        List<StudentResponse> children = parent.getStudents() != null
                ? parent.getStudents().stream().map(this::toStudentResponse).collect(Collectors.toList())
                : Collections.emptyList();

        return ParentResponse.builder()
                .id(parent.getId())
                .userId(parent.getUser().getId())
                .username(parent.getUser().getUsername())
                .email(parent.getUser().getEmail())
                .fullName(parent.getUser().getFullName())
                .phoneNumber(parent.getUser().getPhoneNumber())
                .occupation(parent.getOccupation())
                .relationship(parent.getRelationship())
                .children(children)
                .build();
    }

    public TeacherResponse toTeacherResponse(Teacher teacher) {
        if (teacher == null) return null;
        List<CourseDto> courses = teacher.getCourses() != null
                ? teacher.getCourses().stream().map(this::toCourseDto).collect(Collectors.toList())
                : Collections.emptyList();

        return TeacherResponse.builder()
                .id(teacher.getId())
                .userId(teacher.getUser().getId())
                .employeeCode(teacher.getEmployeeCode())
                .username(teacher.getUser().getUsername())
                .email(teacher.getUser().getEmail())
                .fullName(teacher.getUser().getFullName())
                .phoneNumber(teacher.getUser().getPhoneNumber())
                .specialization(teacher.getSpecialization())
                .qualification(teacher.getQualification())
                .hireDate(teacher.getHireDate())
                .assignedCourses(courses)
                .build();
    }

    public CourseDto toCourseDto(Course course) {
        if (course == null) return null;
        List<SubjectDto> subjects = course.getSubjects() != null
                ? course.getSubjects().stream().map(this::toSubjectDto).collect(Collectors.toList())
                : Collections.emptyList();

        return CourseDto.builder()
                .id(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .category(course.getCategory())
                .description(course.getDescription())
                .credits(course.getCredits())
                .cashDownFee(course.getCashDownFee())
                .installmentMonths(course.getInstallmentMonths())
                .monthlyInstallment(course.getMonthlyInstallment())
                .downPaymentAmount(course.getDownPaymentAmount())
                .focPackage(course.getFocPackage())
                .teacherId(course.getTeacher() != null ? course.getTeacher().getId() : null)
                .teacherName(course.getTeacher() != null && course.getTeacher().getUser() != null ? course.getTeacher().getUser().getFullName() : null)
                .subjects(subjects)
                .enrolledCount(course.getEnrollments() != null ? course.getEnrollments().size() : 0)
                .build();
    }

    public SubjectDto toSubjectDto(Subject subject) {
        if (subject == null) return null;
        return SubjectDto.builder()
                .id(subject.getId())
                .code(subject.getCode())
                .name(subject.getName())
                .courseId(subject.getCourse() != null ? subject.getCourse().getId() : null)
                .courseName(subject.getCourse() != null ? subject.getCourse().getName() : null)
                .teacherId(subject.getTeacher() != null ? subject.getTeacher().getId() : null)
                .teacherName(subject.getTeacher() != null && subject.getTeacher().getUser() != null ? subject.getTeacher().getUser().getFullName() : null)
                .build();
    }

    public TimetableDto toTimetableDto(Timetable timetable) {
        if (timetable == null) return null;
        return TimetableDto.builder()
                .id(timetable.getId())
                .courseId(timetable.getCourse().getId())
                .courseName(timetable.getCourse().getName())
                .subjectId(timetable.getSubject().getId())
                .subjectName(timetable.getSubject().getName())
                .teacherId(timetable.getTeacher() != null ? timetable.getTeacher().getId() : null)
                .teacherName(timetable.getTeacher() != null && timetable.getTeacher().getUser() != null ? timetable.getTeacher().getUser().getFullName() : null)
                .dayOfWeek(timetable.getDayOfWeek())
                .startTime(timetable.getStartTime())
                .endTime(timetable.getEndTime())
                .roomNumber(timetable.getRoomNumber())
                .build();
    }

    public ExamDto toExamDto(Exam exam) {
        if (exam == null) return null;
        return ExamDto.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .examDate(exam.getExamDate())
                .courseId(exam.getCourse().getId())
                .courseName(exam.getCourse().getName())
                .subjectId(exam.getSubject().getId())
                .subjectName(exam.getSubject().getName())
                .maxMarks(exam.getMaxMarks())
                .term(exam.getTerm())
                .build();
    }

    public ResultDto toResultDto(Result result) {
        if (result == null) return null;
        return ResultDto.builder()
                .id(result.getId())
                .examId(result.getExam().getId())
                .examTitle(result.getExam().getTitle())
                .subjectName(result.getExam().getSubject().getName())
                .studentId(result.getStudent().getId())
                .studentCode(result.getStudent().getStudentCode())
                .studentName(result.getStudent().getUser().getFullName())
                .marksObtained(result.getMarksObtained())
                .maxMarks(result.getExam().getMaxMarks())
                .grade(result.getGrade())
                .remarks(result.getRemarks())
                .publishedAt(result.getPublishedAt())
                .build();
    }

    public AttendanceResponse toAttendanceResponse(Attendance attendance) {
        if (attendance == null) return null;
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudent().getId())
                .studentCode(attendance.getStudent().getStudentCode())
                .studentName(attendance.getStudent().getUser().getFullName())
                .courseId(attendance.getCourse().getId())
                .courseName(attendance.getCourse().getName())
                .subjectId(attendance.getSubject() != null ? attendance.getSubject().getId() : null)
                .subjectName(attendance.getSubject() != null ? attendance.getSubject().getName() : null)
                .attendanceDate(attendance.getAttendanceDate())
                .status(attendance.getStatus())
                .remarks(attendance.getRemarks())
                .build();
    }

    public FeeStructureDto toFeeStructureDto(FeeStructure feeStructure) {
        if (feeStructure == null) return null;
        return FeeStructureDto.builder()
                .id(feeStructure.getId())
                .courseId(feeStructure.getCourse().getId())
                .courseName(feeStructure.getCourse().getName())
                .title(feeStructure.getTitle())
                .amount(feeStructure.getAmount())
                .dueDate(feeStructure.getDueDate())
                .term(feeStructure.getTerm())
                .academicYear(feeStructure.getAcademicYear())
                .build();
    }

    public InvoiceResponse toInvoiceResponse(Invoice invoice) {
        if (invoice == null) return null;
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .studentId(invoice.getStudent().getId())
                .studentCode(invoice.getStudent().getStudentCode())
                .studentName(invoice.getStudent().getUser().getFullName())
                .feeStructureId(invoice.getFeeStructure().getId())
                .feeTitle(invoice.getFeeStructure().getTitle())
                .totalAmount(invoice.getTotalAmount())
                .paidAmount(invoice.getPaidAmount())
                .balanceAmount(invoice.getBalanceAmount())
                .status(invoice.getStatus())
                .dueDate(invoice.getDueDate())
                .build();
    }

    public PaymentResponse toPaymentResponse(Payment payment) {
        if (payment == null) return null;
        return PaymentResponse.builder()
                .id(payment.getId())
                .studentId(payment.getStudent().getId())
                .studentCode(payment.getStudent().getStudentCode())
                .studentName(payment.getStudent().getUser().getFullName())
                .feeStructureId(payment.getFeeStructure().getId())
                .feeTitle(payment.getFeeStructure().getTitle())
                .invoiceId(payment.getInvoice() != null ? payment.getInvoice().getId() : null)
                .amountPaid(payment.getAmountPaid())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .paymentPeriod(payment.getPaymentPeriod())
                .receiptNumber(payment.getReceiptNumber())
                .focItems(payment.getFocItems())
                .totalFee(payment.getTotalFee())
                .remainingBalance(payment.getRemainingBalance())
                .salesAgentName(payment.getSalesAgentName())
                .notes(payment.getNotes())
                .transactionReference(payment.getTransactionReference())
                .status(payment.getStatus())
                .build();
    }

    public LeadResponse toLeadResponse(Lead lead) {
        if (lead == null) return null;
        return LeadResponse.builder()
                .id(lead.getId())
                .fullName(lead.getFullName())
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .interestedCourse(lead.getInterestedCourse())
                .status(lead.getStatus())
                .source(lead.getSource())
                .notes(lead.getNotes())
                .assignedUserId(lead.getAssignedUser() != null ? lead.getAssignedUser().getId() : null)
                .assignedUserName(lead.getAssignedUser() != null ? lead.getAssignedUser().getFullName() : null)
                .createdAt(lead.getCreatedAt())
                .build();
    }

    public ComplaintResponse toComplaintResponse(Complaint complaint) {
        if (complaint == null) return null;
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .raisedById(complaint.getRaisedBy().getId())
                .raisedByName(complaint.getRaisedBy().getFullName())
                .studentId(complaint.getStudent() != null ? complaint.getStudent().getId() : null)
                .studentName(complaint.getStudent() != null && complaint.getStudent().getUser() != null ? complaint.getStudent().getUser().getFullName() : null)
                .status(complaint.getStatus())
                .severity(complaint.getSeverity())
                .resolutionNotes(complaint.getResolutionNotes())
                .createdAt(complaint.getCreatedAt())
                .build();
    }

    public DisciplineRecordDto toDisciplineRecordDto(DisciplineRecord record) {
        if (record == null) return null;
        return DisciplineRecordDto.builder()
                .id(record.getId())
                .studentId(record.getStudent().getId())
                .studentName(record.getStudent().getUser().getFullName())
                .studentCode(record.getStudent().getStudentCode())
                .incidentDate(record.getIncidentDate())
                .description(record.getDescription())
                .actionTaken(record.getActionTaken())
                .reportedById(record.getReportedBy() != null ? record.getReportedBy().getId() : null)
                .reportedByName(record.getReportedBy() != null ? record.getReportedBy().getFullName() : null)
                .build();
    }

    public LeaveRequestDto toLeaveRequestDto(LeaveRequest leave) {
        if (leave == null) return null;
        return LeaveRequestDto.builder()
                .id(leave.getId())
                .studentId(leave.getStudent().getId())
                .studentName(leave.getStudent().getUser().getFullName())
                .studentCode(leave.getStudent().getStudentCode())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .reason(leave.getReason())
                .status(leave.getStatus())
                .reviewedById(leave.getReviewedBy() != null ? leave.getReviewedBy().getId() : null)
                .reviewedByName(leave.getReviewedBy() != null ? leave.getReviewedBy().getFullName() : null)
                .build();
    }

    public NotificationResponse toNotificationResponse(Notification notification) {
        if (notification == null) return null;
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientId(notification.getRecipient().getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public StudentDocumentDto toStudentDocumentDto(StudentDocument doc) {
        if (doc == null) return null;
        return StudentDocumentDto.builder()
                .id(doc.getId())
                .studentId(doc.getStudent().getId())
                .documentName(doc.getDocumentName())
                .documentType(doc.getDocumentType())
                .fileUrl(doc.getFileUrl())
                .uploadedAt(doc.getUploadedAt())
                .build();
    }
}
