package com.icms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendStatusUpdateEmail(String toEmail, String complaintId, String newStatus) {
        try {
            // Skip invalid/test emails
            if (toEmail == null || !toEmail.contains("@") || toEmail.endsWith("@test.com")) {
                System.out.println("Skipping email for: " + toEmail);
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("ICMS - Complaint Status Updated: " + complaintId);
            message.setText(buildEmailBody(complaintId, newStatus));

            mailSender.send(message);
            System.out.println("Email sent to: " + toEmail);

        } catch (Exception e) {
            // Never crash status update due to email failure
            System.err.println("Email sending failed (non-critical): " + e.getMessage());
        }
    }

    private String buildEmailBody(String complaintId, String status) {
        String statusText = switch (status) {
            case "IN_PROGRESS" -> "In Progress - Our team is working on it";
            case "RESOLVED" -> "Resolved - Your complaint has been resolved";
            default -> "Pending - Your complaint is awaiting review";
        };

        return """
                Dear Student,

                Your complaint status has been updated.

                Complaint ID: %s
                New Status: %s

                You can login to ICMS to view more details.

                Regards,
                ICMS Team
                """.formatted(complaintId, statusText);
    }
}
