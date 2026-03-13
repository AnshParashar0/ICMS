package com.icms.controller;

import com.icms.dto.ComplaintRequest;
import com.icms.model.Complaint;
import com.icms.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(
            @RequestBody ComplaintRequest request,
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(complaintService.createComplaint(request, token));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Complaint>> myComplaints(
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(complaintService.getUserComplaints(token));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable Long id,
            @RequestParam Complaint.Status status
    ) {
        return ResponseEntity.ok(
                complaintService.updateComplaintStatus(id, status)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok("Complaint deleted");
    }
}
