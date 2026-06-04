package com.grievance.system.dto;

import com.grievance.system.enums.ComplaintStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintResponseDTO {

    private Integer complaintId;

    private Integer userId;
    private String categoryName;

    private String complaintText;

    private String priority;
    private ComplaintStatus status;

    private String predictedDepartment;
    private String predictedPriority;
    private Integer predictedResolutionTime;

    private LocalDateTime createdAt;
}