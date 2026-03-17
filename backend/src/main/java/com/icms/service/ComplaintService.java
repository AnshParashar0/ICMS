package com.icms.service;

import java.util.List;

import com.icms.model.User;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final EmailService emailService; // ✅ inject email service

    public @NonNull Complaint createComplaint(@NonNull ComplaintRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = Complaint.builder()
                .complaintId("CMP" + System.currentTimeMillis())
                .user(user)
                .studentName(user.getName())
                .category(request.getCategory())
                .location(request.getLocation())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(Complaint.Status.PENDING)
                .contactNumber(request.getContactNumber())
                .build();

        return complaintRepository.save(complaint);
    }

    public @NonNull List<Complaint> getAllComplaints() {
        List<Complaint> complaints = complaintRepository.findAll();
        complaints.forEach(complaint -> {
            if (complaint.getUser() != null) {
                complaint.setStudentName(complaint.getUser().getName());
            }
        });
        return complaints;
    }

    public @NonNull Complaint updateComplaintStatus(@NonNull Long id, @NonNull Complaint.Status status) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        complaint.setStatus(status);
        Complaint updated = complaintRepository.save(complaint);

        // ✅ Send email notification (silently fails if email is invalid)
        if (updated.getUser() != null) {
            emailService.sendStatusUpdateEmail(
                updated.getUser().getEmail(),
                updated.getComplaintId(),
                status.name()
            );
        }

        return updated;
    }

    public @NonNull List<Complaint> getUserComplaints() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Complaint> complaints = complaintRepository.findByUser(user);
        complaints.forEach(complaint -> {
            if (complaint.getUser() != null) {
                complaint.setStudentName(complaint.getUser().getName());
            }
        });
        return complaints;
    }

    public void deleteComplaint(@NonNull Long id) {
        complaintRepository.deleteById(id);
    }
}