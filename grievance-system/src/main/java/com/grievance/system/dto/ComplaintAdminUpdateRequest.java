package com.grievance.system.dto;

import com.grievance.system.enums.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class ComplaintAdminUpdateRequest {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;

    @NotBlank(message = "Priority is required")
    private String priority;
}

