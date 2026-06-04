package com.grievance.system.dto;

import com.grievance.system.enums.ComplaintStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintHistoryDTO {

    private ComplaintStatus oldStatus;
    private ComplaintStatus newStatus;
    private String changedBy;
    private LocalDateTime changedAt;
}