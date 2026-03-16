package com.icms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String complaintId;

    @ManyToOne
    private User user;

    private String category;
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String contactNumber;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Transient field for frontend display
    @Transient
    private String studentName;

    public enum Priority { LOW, MEDIUM, HIGH, URGENT }

    public enum Status { PENDING, IN_PROGRESS, RESOLVED }

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PostLoad
    void postLoad() {
        if (user != null) {
            this.studentName = user.getName();
        }
    }
}