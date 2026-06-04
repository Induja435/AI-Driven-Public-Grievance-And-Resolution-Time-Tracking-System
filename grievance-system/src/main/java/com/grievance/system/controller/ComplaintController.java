package com.grievance.system.controller;

import com.grievance.system.service.ComplaintService;

import com.grievance.system.dto.*;
import com.grievance.system.enums.ComplaintStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private static final Logger log = LoggerFactory.getLogger(ComplaintController.class);

    @Autowired
    private ComplaintService complaintService;

    // 1️⃣ Create complaint
    @PostMapping
    public ApiResponse<ComplaintResponseDTO> createComplaint(
            @Valid @RequestBody ComplaintRequestDTO request) {

        log.info("API CALL: Create complaint");

        ComplaintResponseDTO response = complaintService.createComplaint(request);

        return new ApiResponse<>(
                "success",
                "Complaint created successfully",
                response
        );
    }

    // 2️⃣ Get all complaints (pagination)
    @GetMapping
    public ApiResponse<Page<ComplaintResponseDTO>> getAllComplaints(Pageable pageable) {

        log.info("API CALL: Get complaints with pagination");

        Page<ComplaintResponseDTO> data =
                complaintService.getComplaintsWithPagination(pageable);

        return new ApiResponse<>(
                "success",
                "Complaints fetched successfully",
                data
        );
    }

    // 3️⃣ Get complaint by ID
    @GetMapping("/{id}")
    public ApiResponse<ComplaintResponseDTO> getComplaintById(@PathVariable Integer id) {

        log.info("API CALL: Get complaint by ID {}", id);

        return new ApiResponse<>(
                "success",
                "Complaint fetched successfully",
                complaintService.getComplaintById(id)
        );
    }

    // 5️⃣ Admin update
    @PutMapping("/{id}/admin-update")
    public ApiResponse<ComplaintResponseDTO> adminUpdateComplaint(
            @PathVariable Integer id,
            @Valid @RequestBody ComplaintAdminUpdateRequest request
    ) {

        log.info("API CALL: Admin updating complaint {}", id);

        ComplaintResponseDTO updated =
                complaintService.updateComplaintStatusAndPriority(
                        id,
                        request.getStatus(),
                        request.getPriority()
                );

        return new ApiResponse<>(
                "success",
                "Complaint updated successfully",
                updated
        );
    }
    // 6️⃣ History
    @GetMapping("/{id}/history")
    public ApiResponse<List<ComplaintHistoryDTO>> getComplaintHistory(@PathVariable Integer id) {

        log.info("API CALL: Get history for complaint {}", id);

        return new ApiResponse<>(
                "success",
                "Complaint history fetched successfully",
                complaintService.getComplaintHistory(id)
        );
    }

    // 7️⃣ Dashboard
    @GetMapping("/admin/dashboard")
    public ApiResponse<DashboardResponse> getDashboard() {

        log.info("API CALL: Dashboard stats");

        return new ApiResponse<>(
                "success",
                "Dashboard fetched successfully",
                complaintService.getDashboardStats()
        );
    }

    // 8️⃣ Department workload
    @GetMapping("/admin/department-workload")
    public ApiResponse<Map<String, Long>> getDepartmentWorkload() {

        log.info("API CALL: Department workload");

        return new ApiResponse<>(
                "success",
                "Department workload fetched successfully",
                complaintService.getDepartmentWorkload()
        );
    }

    // 9️⃣ Overdue complaints
    @GetMapping("/admin/overdue-complaints")
    public ApiResponse<Page<ComplaintResponseDTO>> getOverdueComplaints(Pageable pageable) {

        log.info("API CALL: Overdue complaints (paginated)");

        return new ApiResponse<>(
                "success",
                "Overdue complaints fetched successfully",
                complaintService.getOverdueComplaints(pageable)
        );
    }

    // 🔟 Search APIs

    @GetMapping("/search")
    public ApiResponse<Page<ComplaintResponseDTO>> searchComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer userId,
            Pageable pageable
    ) {

        return new ApiResponse<>(
                "success",
                "Filtered complaints fetched successfully",
                complaintService.searchComplaints(status, department, userId, pageable)
        );
    }

    @GetMapping("/search/user")
    public ApiResponse<Page<ComplaintResponseDTO>> getByUser(
            @RequestParam Integer userId,
            @RequestParam int page,
            @RequestParam int size
    ) {

        return new ApiResponse<>(
                "success",
                "Filtered by user",
                complaintService.getComplaintsByUser(userId, PageRequest.of(page, size))
        );
    }
//problem
    @GetMapping("/search/email")
    public ApiResponse<Page<ComplaintResponseDTO>> getByEmail(
            @RequestParam String email,
            @RequestParam int page,
            @RequestParam int size
    ) {

        return new ApiResponse<>(
                "success",
                "Filtered by email",
                complaintService.getComplaintsByEmail(
                        email,
                        PageRequest.of(page, size)
                )
        );
    }
}


