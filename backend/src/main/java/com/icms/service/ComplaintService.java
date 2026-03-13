
package com.icms.service;

import java.util.List;

import com.icms.model.User;
import org.springframework.stereotype.Service;

import com.icms.dto.ComplaintRequest;
import com.icms.model.Complaint;
import com.icms.repository.ComplaintRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserService userService;

    public Complaint createComplaint(ComplaintRequest request, String email) {

        User user = userService.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = Complaint.builder()
                .complaintId("CMP" + System.currentTimeMillis())
                .user(user)
                .category(request.getCategory())
                .location(request.getLocation())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(Complaint.Status.PENDING)
                .contactNumber(request.getContactNumber())
                .build();

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint updateComplaintStatus(Long id, Complaint.Status status) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }
    public List<Complaint> getUserComplaints(String email) {

    User user = userService.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return complaintRepository.findByUser(user);
}

    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }
}