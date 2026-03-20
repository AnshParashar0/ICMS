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
            if (toEmail == null || !toEmail.contains("@") || toEmail.endsWith("@test.com")) {
                System.out.println("Skipping email for: " + toEmail);
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("ICMS - Complaint Status Updated: " + complaintId);
            message.setText(buildStatusEmailBody(complaintId, newStatus));

            mailSender.send(message);
            System.out.println("Status email sent to: " + toEmail);

        } catch (Exception e) {
            System.err.println("Email sending failed (non-critical): " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        try {
            if (toEmail == null || !toEmail.contains("@") || toEmail.endsWith("@test.com")) {
                System.out.println("Skipping welcome email for: " + toEmail);
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Welcome to ICMS - Infrastructure Complaint Management System");
            message.setText(buildWelcomeEmailBody(name));

            mailSender.send(message);
            System.out.println("Welcome email sent to: " + toEmail);

        } catch (Exception e) {
            System.err.println("Welcome email failed (non-critical): " + e.getMessage());
        }
    }

    private String buildStatusEmailBody(String complaintId, String status) {
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

    private String buildWelcomeEmailBody(String name) {
        return """
                Dear %s,

                Welcome to ICMS - Infrastructure Complaint Management System!

                Your account has been created successfully. You can now:
                - Submit infrastructure complaints
                - Track the status of your complaints
                - Get notified when your complaint is updated

                Login at: http://localhost:5173

                Regards,
                ICMS Team
                """.formatted(name);
    }
}