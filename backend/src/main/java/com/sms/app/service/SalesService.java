package com.sms.app.service;

import com.sms.app.dto.*;
import com.sms.app.entity.*;
import com.sms.app.exception.ResourceNotFoundException;
import com.sms.app.mapper.EntityMapper;
import com.sms.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Transactional
    public LeadResponse createLead(LeadCreateRequest request) {
        User assignedUser = null;
        if (request.getAssignedUserId() != null) {
            assignedUser = userRepository.findById(request.getAssignedUserId()).orElse(null);
        }

        Lead lead = Lead.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .interestedCourse(request.getInterestedCourse())
                .status(request.getStatus() != null ? request.getStatus() : LeadStatus.NEW)
                .source(request.getSource())
                .notes(request.getNotes())
                .assignedUser(assignedUser)
                .build();
        lead = leadRepository.save(lead);
        return mapper.toLeadResponse(lead);
    }

    @Transactional
    public LeadResponse updateLead(Long id, LeadUpdateRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));

        if (request.getFullName() != null) lead.setFullName(request.getFullName());
        if (request.getEmail() != null) lead.setEmail(request.getEmail());
        if (request.getPhone() != null) lead.setPhone(request.getPhone());
        if (request.getInterestedCourse() != null) lead.setInterestedCourse(request.getInterestedCourse());
        if (request.getStatus() != null) lead.setStatus(request.getStatus());
        if (request.getSource() != null) lead.setSource(request.getSource());
        if (request.getNotes() != null) lead.setNotes(request.getNotes());

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId()).orElse(null);
            lead.setAssignedUser(assignedUser);
        }

        lead = leadRepository.save(lead);
        return mapper.toLeadResponse(lead);
    }

    @Transactional(readOnly = true)
    public LeadResponse getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        return mapper.toLeadResponse(lead);
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> getLeadsByStatus(LeadStatus status) {
        return leadRepository.findByStatus(status).stream()
                .map(mapper::toLeadResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<LeadResponse> getAllLeads(Pageable pageable) {
        Page<Lead> page = leadRepository.findByIsDeletedFalse(pageable);
        List<LeadResponse> content = page.getContent().stream()
                .map(mapper::toLeadResponse)
                .collect(Collectors.toList());

        return PageResponse.<LeadResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
