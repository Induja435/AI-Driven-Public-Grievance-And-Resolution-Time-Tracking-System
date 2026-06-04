package com.grievance.system.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintRequestDTO {

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    @NotBlank(message = "Complaint text is required")
    private String complaintText;

    private String priority; // optional (AI can override)
}