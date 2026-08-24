package com.icms.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "workers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String department;
    private String phone;
    private String email;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;

    public enum Status { AVAILABLE, BUSY, OFF_DUTY }

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = Status.AVAILABLE;
    }
}
