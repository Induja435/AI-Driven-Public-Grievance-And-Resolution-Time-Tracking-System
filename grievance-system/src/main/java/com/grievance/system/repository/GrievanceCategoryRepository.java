package com.grievance.system.repository;

import com.grievance.system.model.GrievanceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrievanceCategoryRepository
        extends JpaRepository<GrievanceCategory, Integer> {
}
