package com.grievance.system.repository;

import com.grievance.system.model.Complaint;
import com.grievance.system.enums.ComplaintStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface ComplaintRepository extends
        JpaRepository<Complaint, Integer>,
        JpaSpecificationExecutor<Complaint> {

    // ✅ Existing methods
    List<Complaint> findByUser_UserId(Integer userId);

    long count();

    long countByStatus(ComplaintStatus status);

    // ✅ PAGINATION METHODS
    Page<Complaint> findAll(Pageable pageable);

    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);

    Page<Complaint> findByUser_UserId(Integer userId, Pageable pageable);

    Page<Complaint> findByPredictedDepartment(String department, Pageable pageable);

    Page<Complaint> findByUser_Email(String email, Pageable pageable);

    // ✅ WORKLOAD (Department-wise)
    @Query("SELECT c.predictedDepartment, COUNT(c) FROM Complaint c GROUP BY c.predictedDepartment")
    List<Object[]> countComplaintsByDepartment();

    // ✅ SLA TRACKING (Active complaints)
    @Query("""
        SELECT c FROM Complaint c
        WHERE c.status != 'RESOLVED'
        AND c.status != 'CLOSED'
    """)
    List<Complaint> findActiveComplaints();
}



