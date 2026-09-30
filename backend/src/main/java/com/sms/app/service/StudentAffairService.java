package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.event.ComplaintRaisedEvent;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentAffairService {

    private final ComplaintRepository complaintRepository;
    private final DisciplineRecordRepository disciplineRecordRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final EntityMapper mapper;

    @Transactional
    public ComplaintResponse createComplaint(ComplaintCreateRequest request, Long userId) {
        User raisedBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Student student = null;
        if (request.getStudentId() != null) {
            student = studentRepository.findById(request.getStudentId()).orElse(null);
        }

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .raisedBy(raisedBy)
                .student(student)
                .severity(request.getSeverity() != null ? request.getSeverity() : ComplaintSeverity.MEDIUM)
                .status(ComplaintStatus.PENDING)
                .build();
        complaint = complaintRepository.save(complaint);

        eventPublisher.publishEvent(new ComplaintRaisedEvent(
                this,
                complaint.getId(),
                complaint.getTitle(),
                raisedBy.getId(),
                student != null ? student.getId() : null,
                complaint.getSeverity()
        ));

        return mapper.toComplaintResponse(complaint);
    }

    @Transactional
    public ComplaintResponse resolveComplaint(Long id, ComplaintStatus status, String resolutionNotes) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));

        complaint.setStatus(status);
        complaint.setResolutionNotes(resolutionNotes);
        complaint = complaintRepository.save(complaint);
        return mapper.toComplaintResponse(complaint);
    }

    @Transactional(readOnly = true)
    public PageResponse<ComplaintResponse> getAllComplaints(Pageable pageable) {
        Page<Complaint> page = complaintRepository.findByIsDeletedFalse(pageable);
        List<ComplaintResponse> list = page.getContent().stream()
                .map(mapper::toComplaintResponse)
                .collect(Collectors.toList());

        return PageResponse.<ComplaintResponse>builder()
                .content(list)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Transactional
    public DisciplineRecordDto recordDiscipline(DisciplineRecordDto dto, Long reportedById) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + dto.getStudentId()));
        User reporter = reportedById != null ? userRepository.findById(reportedById).orElse(null) : null;

        DisciplineRecord record = DisciplineRecord.builder()
                .student(student)
                .incidentDate(dto.getIncidentDate())
                .description(dto.getDescription())
                .actionTaken(dto.getActionTaken())
                .reportedBy(reporter)
                .build();
        record = disciplineRecordRepository.save(record);
        return mapper.toDisciplineRecordDto(record);
    }

    @Transactional(readOnly = true)
    public List<DisciplineRecordDto> getDisciplineByStudent(Long studentId) {
        return disciplineRecordRepository.findByStudentId(studentId).stream()
                .map(mapper::toDisciplineRecordDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveRequestDto applyForLeave(LeaveRequestDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + dto.getStudentId()));

        LeaveRequest leave = LeaveRequest.builder()
                .student(student)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .reason(dto.getReason())
                .status(LeaveStatus.PENDING)
                .build();
        leave = leaveRequestRepository.save(leave);
        return mapper.toLeaveRequestDto(leave);
    }

    @Transactional
    public LeaveRequestDto updateLeaveStatus(Long leaveId, LeaveStatus status, Long reviewerId) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveId));
        User reviewer = reviewerId != null ? userRepository.findById(reviewerId).orElse(null) : null;

        leave.setStatus(status);
        leave.setReviewedBy(reviewer);
        leave = leaveRequestRepository.save(leave);
        return mapper.toLeaveRequestDto(leave);
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getLeavesByStudent(Long studentId) {
        return leaveRequestRepository.findByStudentId(studentId).stream()
                .map(mapper::toLeaveRequestDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getAllLeaveRequests() {
        return leaveRequestRepository.findAll().stream()
                .map(mapper::toLeaveRequestDto)
                .collect(Collectors.toList());
    }
}
