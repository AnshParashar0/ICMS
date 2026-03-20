package com.icms.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import com.icms.model.Complaint;
import com.icms.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.icms.repository.ComplaintRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserService userService;
    private final EmailService emailService;

    @Value("${file.upload.dir}")
    private String uploadDir;

    public @NonNull Complaint createComplaint(
            String category, String location, String description,
            String priority, String contactNumber, MultipartFile image
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Save image if provided
        String imagePath = null;
        if (image != null && !image.isEmpty()) {
            imagePath = saveImage(image);
        }

        Complaint complaint = Complaint.builder()
                .complaintId("CMP" + System.currentTimeMillis())
                .user(user)
                .studentName(user.getName())
                .category(category)
                .location(location)
                .description(description)
                .priority(Complaint.Priority.valueOf(priority))
                .status(Complaint.Status.PENDING)
                .contactNumber(contactNumber)
                .imagePath(imagePath)
                .build();

        return complaintRepository.save(complaint);
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            return uploadDir + "/" + fileName;
        } catch (IOException e) {
            System.err.println("Image save failed: " + e.getMessage());
            return null;
        }
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