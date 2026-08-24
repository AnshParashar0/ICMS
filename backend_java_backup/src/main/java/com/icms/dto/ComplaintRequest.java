package com.icms.dto;

import com.icms.model.Complaint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintRequest {

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @NotBlank(message = "Description is required")
    private String description;

    private Complaint.Priority priority = Complaint.Priority.MEDIUM;

    @Size(max = 20, message = "Contact number must not exceed 20 characters")
    private String contactNumber;
}