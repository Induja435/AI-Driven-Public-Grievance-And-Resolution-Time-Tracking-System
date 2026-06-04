package com.grievance.system.service;

import com.grievance.system.enums.ComplaintStatus;
import com.grievance.system.enums.Role;

import com.grievance.system.exception.InvalidStatusTransitionException;
import com.grievance.system.exception.ResourceNotFoundException;

import com.grievance.system.model.Complaint;
import com.grievance.system.model.ComplaintStatusHistory;
import com.grievance.system.model.User;

import com.grievance.system.repository.ComplaintRepository;
import com.grievance.system.repository.ComplaintStatusHistoryRepository;
import com.grievance.system.repository.UserRepository;

import com.grievance.system.dto.*;
import com.grievance.system.mapper.ComplaintMapper;
import com.grievance.system.dto.ComplaintHistoryDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;

import org.springframework.data.jpa.domain.Specification;
import com.grievance.system.specification.ComplaintSpecification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.time.LocalDateTime;

import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class ComplaintService {

    private static final Logger log = LoggerFactory.getLogger(ComplaintService.class);

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintStatusHistoryRepository historyRepository;

    @Autowired
    private ComplaintMapper complaintMapper;

    // 1️⃣ Create complaint
    public ComplaintResponseDTO createComplaint(ComplaintRequestDTO request) {

        log.info("Creating complaint request received");

        // ✅ CREATE ENTITY
        Complaint complaint = new Complaint();

        // ✅ GET LOGGED-IN USER FROM JWT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        log.info("Creating complaint for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

         // ✅ SET USER ID
        complaint.setUser(user);

        //category part
        complaint.setCategoryId(request.getCategoryId());
        complaint.setComplaintText(request.getComplaintText());

        RestTemplate restTemplate = new RestTemplate();

        String aiUrl = "http://127.0.0.1:8000/predict";

        // Request body
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("text", request.getComplaintText());

        try {
            log.info("Sending complaint to AI: {}", request.getComplaintText());
            AiResponse response = restTemplate.postForObject(
                    aiUrl,
                    requestMap,
                    AiResponse.class
            );

            if (response == null || response.getDepartment() == null) {
                throw new RuntimeException("Invalid AI response");
            }
            log.info("AI Response → Dept: {}, Priority: {}, Days: {}, Confidence: {}",
                    response.getDepartment(),
                    response.getPriority(),
                    response.getResolutionDays(),
                    response.getConfidence());

            // 🔥 store confidence (optional but recommended)
            complaint.setAiConfidence(response.getConfidence());

            if (response.getConfidence() < 0.5) {

                log.warn("Low confidence → fallback applied");

                complaint.setPredictedDepartment("General");
                complaint.setPredictedPriority("LOW");
                complaint.setPredictedResolutionTime(5);

            } else {

                complaint.setPredictedDepartment(response.getDepartment());
                complaint.setPredictedPriority(response.getPriority());
                complaint.setPredictedResolutionTime(response.getResolutionDays());
                log.info("Final Prediction → Dept: {}, Priority: {}, Days: {}",
                        complaint.getPredictedDepartment(),
                        complaint.getPredictedPriority(),
                        complaint.getPredictedResolutionTime());
            }

        } catch (Exception e) {

            log.error("AI service failed: {}", e.getMessage());

            complaint.setPredictedDepartment("General");
            complaint.setPredictedPriority("LOW");
            complaint.setPredictedResolutionTime(5);

            // optional
            complaint.setAiConfidence(0.0);
        }

        complaint.setPriority(complaint.getPredictedPriority());
        complaint.setStatus(ComplaintStatus.PENDING);

        Complaint savedComplaint = complaintRepository.save(complaint);

        log.info("Complaint created successfully with ID: {}", savedComplaint.getComplaintId());

        // ✅ HISTORY
        ComplaintStatusHistory history = new ComplaintStatusHistory();
        history.setComplaint(savedComplaint);
        history.setOldStatus(null);
        history.setNewStatus(ComplaintStatus.PENDING);
        history.setChangedBy("SYSTEM");

        historyRepository.save(history);

        // ✅ RETURN DTO
        return complaintMapper.toDTO(savedComplaint);
    }

    // 2️⃣ Get all complaints ✅ DTO
    public List<ComplaintResponseDTO> getAllComplaints() {
        log.info("Total complaints fetched: {}", complaintRepository.count());

        return complaintRepository.findAll()
                .stream()
                .map(complaintMapper::toDTO)
                .toList();
    }

    // ✅ Pagination version
    public Page<ComplaintResponseDTO> getComplaintsWithPagination(Pageable pageable) {

        log.info("Fetching complaints with role-based filtering");

        // ✅ STEP 1: Get logged-in user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        log.info("Logged-in email: {}", email);

        // ✅ STEP 2: Fetch user from DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 🔥 DEBUG LOGS (VERY IMPORTANT)
        log.info("User ID: {}", user.getUserId());
        log.info("User Role from DB: '{}'", user.getRole());

        Page<Complaint> complaints;


        if (user.getRole() == Role.ADMIN) {

            log.info("✅ ADMIN detected → Fetching ALL complaints");
            complaints = complaintRepository.findAll(pageable);

        } else {

            log.info("❌ USER detected → Fetching ONLY own complaints: {}", user.getUserId());
            complaints = complaintRepository.findByUser_UserId(user.getUserId(), pageable);
        }

        return complaints.map(complaintMapper::toDTO);
    }

    // 3️⃣ Get by ID ✅ DTO
    public ComplaintResponseDTO getComplaintById(Integer id) {
        log.info("Fetching complaint with ID: {}", id);

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Complaint not found with ID: {}", id);
                    return new ResourceNotFoundException("Complaint not found");
                });

        return complaintMapper.toDTO(complaint);
    }


    // 4️⃣ Get by user ✅ DTO
    public List<ComplaintResponseDTO> getComplaintsByUserId(Integer userId) {
        log.info("Fetching complaints for user: {}", userId);

        return complaintRepository.findByUser_UserId(userId)
                .stream()
                .map(complaintMapper::toDTO)
                .toList();
    }
   //problem
    public Page<ComplaintResponseDTO> getComplaintsByEmail(String email, Pageable pageable) {

        Page<Complaint> complaints =
            complaintRepository.findByUser_Email(email, pageable);

        return complaints.map(complaintMapper::toDTO);
    }

    // pagination methods ✅ DTO
    public Page<ComplaintResponseDTO> getComplaintsByStatus(ComplaintStatus status, Pageable pageable) {
        log.info("Fetching complaints by status: {}", status);

        return complaintRepository.findByStatus(status, pageable)
                .map(complaintMapper::toDTO);
    }

    public Page<ComplaintResponseDTO> getComplaintsByUser(Integer userId, Pageable pageable) {
        log.info("Fetching complaints by user: {}", userId);

        return complaintRepository.findByUser_UserId(userId, pageable)
                .map(complaintMapper::toDTO);
    }

    public Page<ComplaintResponseDTO> getComplaintsByDepartment(String department, Pageable pageable) {
        log.info("Fetching complaints by department: {}", department);

        return complaintRepository.findByPredictedDepartment(department, pageable)
                .map(complaintMapper::toDTO);
    }

    // 5️⃣ Admin update ✅ RETURN DTO
    public ComplaintResponseDTO updateComplaintStatusAndPriority(
            Integer complaintId,
            ComplaintStatus newStatus,
            String priority
    ) {

        log.info("Admin updating complaint ID: {} to status: {}", complaintId, newStatus);

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> {
                    log.error("Complaint not found for update: {}", complaintId);
                    return new ResourceNotFoundException("Complaint not found");
                });

        ComplaintStatus currentStatus = complaint.getStatus();

        boolean valid =
                (currentStatus == ComplaintStatus.PENDING && newStatus == ComplaintStatus.IN_PROGRESS) ||
                        (currentStatus == ComplaintStatus.IN_PROGRESS && newStatus == ComplaintStatus.RESOLVED) ||
                        (currentStatus == ComplaintStatus.RESOLVED && newStatus == ComplaintStatus.CLOSED);

        if (!valid) {
            log.warn("Invalid status transition from {} to {}", currentStatus, newStatus);
            throw new InvalidStatusTransitionException(
                    "Invalid status transition: " + currentStatus + " → " + newStatus
            );
        }

        ComplaintStatusHistory history = new ComplaintStatusHistory();
        history.setComplaint(complaint);
        history.setOldStatus(currentStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy("ADMIN");

        historyRepository.save(history);

        complaint.setStatus(newStatus);
        complaint.setPriority(priority);

        Complaint updated = complaintRepository.save(complaint);

        log.info("Complaint {} updated successfully", complaintId);

        return complaintMapper.toDTO(updated);
    }
    // 6️⃣ Dashboard
    public DashboardResponse getDashboardStats() {

        log.info("Fetching dashboard statistics");

        DashboardResponse dashboard = new DashboardResponse();

        dashboard.setTotalComplaints(complaintRepository.count());
        dashboard.setPendingComplaints(complaintRepository.countByStatus(ComplaintStatus.PENDING));
        dashboard.setInProgressComplaints(complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS));
        dashboard.setResolvedComplaints(complaintRepository.countByStatus(ComplaintStatus.RESOLVED));
        dashboard.setClosedComplaints(complaintRepository.countByStatus(ComplaintStatus.CLOSED));

        return dashboard;
    }

    // Department workload
    public Map<String, Long> getDepartmentWorkload() {

        log.info("Fetching department workload");

        List<Object[]> results = complaintRepository.countComplaintsByDepartment();
        Map<String, Long> workload = new HashMap<>();

        for (Object[] row : results) {
            String department = (String) row[0];
            Long count = (Long) row[1];

            if (department == null) {
                department = "Unknown Department";
            }

            workload.put(department, count);
        }

        return workload;
    }

    // SLA tracking
    public Page<ComplaintResponseDTO> getOverdueComplaints(Pageable pageable) {

        log.info("Checking overdue complaints with pagination");

        List<Complaint> activeComplaints = complaintRepository.findActiveComplaints();
        List<Complaint> overdueComplaints = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();

        for (Complaint complaint : activeComplaints) {

            if (complaint.getCreatedAt() == null || complaint.getPredictedResolutionTime() == null) {
                continue;
            }

            LocalDateTime deadline =
                    complaint.getCreatedAt().plusDays(complaint.getPredictedResolutionTime());

            if (now.isAfter(deadline)) {
                overdueComplaints.add(complaint);
            }
        }

        log.info("Total overdue complaints: {}", overdueComplaints.size());

        // 🔥 PAGINATION LOGIC
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), overdueComplaints.size());

        List<ComplaintResponseDTO> dtoList = overdueComplaints.subList(start, end)
                .stream()
                .map(complaintMapper::toDTO)
                .toList();

        return new PageImpl<>(dtoList, pageable, overdueComplaints.size());
    }

    // 7️⃣ Complaint History DTO method
    public List<ComplaintHistoryDTO> getComplaintHistory(Integer id) {

        log.info("Fetching history for complaint ID: {}", id);

        return historyRepository.findByComplaint_ComplaintId(id)
                .stream()
                .map(h -> {
                    ComplaintHistoryDTO dto = new ComplaintHistoryDTO();
                    dto.setOldStatus(h.getOldStatus());
                    dto.setNewStatus(h.getNewStatus());
                    dto.setChangedBy(h.getChangedBy());
                    dto.setChangedAt(h.getChangedAt());
                    return dto;
                })
                .toList();
    }
    //searching method
    public Page<ComplaintResponseDTO> searchComplaints(
            ComplaintStatus status,
            String department,
            Integer userId,
            Pageable pageable) {

        log.info("Searching complaints with filters");

        // ✅ GET LOGGED USER
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        log.info("Logged user role: {}", user.getRole());

        // ✅ BUILD BASE SPEC
        Specification<Complaint> spec = Specification
                .where(ComplaintSpecification.hasStatus(status))
                .and(ComplaintSpecification.hasDepartment(department));

        // 🔥 FIXED ROLE CHECK
        if (user.getRole() == Role.ADMIN) {

            log.info("ADMIN searching all complaints");

            if (userId != null) {
                spec = spec.and(ComplaintSpecification.hasUserId(user.getUserId()));
            }

        } else {

            log.info("USER searching only their complaints");

            spec = spec.and(ComplaintSpecification.hasUserId(user.getUserId()));
        }

        return complaintRepository.findAll(spec, pageable)
                .map(complaintMapper::toDTO);
    }
}







