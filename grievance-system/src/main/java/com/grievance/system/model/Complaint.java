package com.grievance.system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.grievance.system.enums.ComplaintStatus;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "complaint_id")
    private Integer complaintId;

    @NotNull(message = "User ID is required")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull(message = "Category ID is required")
    @Column(name = "category_id")
    private Integer categoryId;

    @NotBlank(message = "Complaint text cannot be empty")
    @Column(name = "complaint_text", nullable = false)
    private String complaintText;

    @Column(name = "priority")
    private String priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ComplaintStatus status;

    // 🔹 AI PREDICTION FIELDS
    @Column(name = "predicted_department")
    private String predictedDepartment;

    @Column(name = "predicted_priority")
    private String predictedPriority;

    @Column(name = "predicted_resolution_time")
    private Integer predictedResolutionTime; // in days

    @Column(name = "ai_confidence")
    private Double aiConfidence;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}


