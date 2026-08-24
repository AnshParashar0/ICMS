package com.icms.controller;

import com.icms.model.Complaint;
import com.icms.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Complaint> createComplaint(
            @RequestParam("category") String category,
            @RequestParam("location") String location,
            @RequestParam("description") String description,
            @RequestParam("priority") String priority,
            @RequestParam(value = "contactNumber", required = false) String contactNumber,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        return ResponseEntity.ok(complaintService.createComplaint(
                category, location, description, priority, contactNumber, image
        ));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Complaint>> myComplaints() {
        return ResponseEntity.ok(complaintService.getUserComplaints());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable("id") @NonNull Long id,
            @RequestParam("status") @NonNull Complaint.Status status
    ) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteComplaint(@PathVariable @NonNull Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok("Complaint deleted");
    }
}