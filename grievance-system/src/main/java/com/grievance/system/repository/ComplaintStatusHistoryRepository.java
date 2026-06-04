package com.grievance.system.repository;

import com.grievance.system.model.ComplaintStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintStatusHistoryRepository
        extends JpaRepository<ComplaintStatusHistory, Integer> {

    List<ComplaintStatusHistory> findByComplaint_ComplaintId(Integer complaintId);
}

