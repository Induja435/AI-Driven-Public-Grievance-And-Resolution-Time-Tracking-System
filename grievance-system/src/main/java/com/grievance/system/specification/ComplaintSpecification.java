package com.grievance.system.specification;

import com.grievance.system.model.Complaint;
import com.grievance.system.enums.ComplaintStatus;

import org.springframework.data.jpa.domain.Specification;

public class ComplaintSpecification {

    // ✅ Filter by status
    public static Specification<Complaint> hasStatus(ComplaintStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return null;
            }
            return cb.equal(root.get("status"), status);
        };
    }

    // ✅ Filter by department (LIKE search)
    public static Specification<Complaint> hasDepartment(String department) {
        return (root, query, cb) -> {
            if (department == null || department.trim().isEmpty()) {
                return null;
            }
            return cb.like(
                    cb.lower(root.get("predictedDepartment")),
                    "%" + department.toLowerCase() + "%"
            );
        };
    }

    // ✅ FIXED: Filter by userId (RELATIONSHIP)
    public static Specification<Complaint> hasUserId(Integer userId) {
        return (root, query, cb) -> {
            if (userId == null) {
                return null;
            }
            return cb.equal(
                    root.get("user").get("userId"), // LEFT
                    userId                          // RIGHT ✅ (THIS WAS MISSING)
            );
        };
    }
}