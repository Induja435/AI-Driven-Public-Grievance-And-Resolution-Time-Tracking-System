package com.grievance.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {

    private String status;   // success / error
    private String message;  // description
    private T data;          // actual response
}