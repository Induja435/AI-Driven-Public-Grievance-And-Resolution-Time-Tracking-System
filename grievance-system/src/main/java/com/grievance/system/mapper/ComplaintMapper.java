package com.grievance.system.mapper;

import com.grievance.system.dto.ComplaintResponseDTO;
import com.grievance.system.model.Complaint;
import com.grievance.system.repository.GrievanceCategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ComplaintMapper {

    @Autowired
    private GrievanceCategoryRepository categoryRepository;

    public ComplaintResponseDTO toDTO(Complaint complaint) {

        ComplaintResponseDTO dto = new ComplaintResponseDTO();

        dto.setComplaintId(complaint.getComplaintId());
        dto.setUserId(complaint.getUser().getUserId());

        // 🔥 FIXED CATEGORY NAME
        String categoryName = categoryRepository.findById(complaint.getCategoryId())
                .map(cat -> cat.getCategoryName())
                .orElse("Unknown");

        dto.setCategoryName(categoryName);

        dto.setComplaintText(complaint.getComplaintText());
        dto.setPriority(complaint.getPriority());
        dto.setStatus(complaint.getStatus());

        dto.setPredictedDepartment(complaint.getPredictedDepartment());
        dto.setPredictedPriority(complaint.getPredictedPriority());
        dto.setPredictedResolutionTime(complaint.getPredictedResolutionTime());

        dto.setCreatedAt(complaint.getCreatedAt());

        return dto;
    }
}