package com.grievance.system.dto;

import lombok.Data;

@Data
public class DashboardResponse {

    private long totalComplaints;
    private long pendingComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long closedComplaints;

}