package com.grievance.system.dto;

import lombok.Data;

@Data
public class AiResponse {

    private String department;
    private String priority;
    private int resolutionDays;
    private double confidence;

}