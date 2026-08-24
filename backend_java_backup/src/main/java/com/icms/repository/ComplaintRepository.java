package com.icms.repository;

import com.icms.model.Complaint;
import com.icms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByComplaintId(String complaintId);

    List<Complaint> findByUser(User user);

    List<Complaint> findByUserId(Long userId);

    List<Complaint> findByStatus(Complaint.Status status);

    List<Complaint> findByCategory(String category);

    List<Complaint> findTop5ByOrderByCreatedAtDesc();

    long countByStatus(Complaint.Status status);

}