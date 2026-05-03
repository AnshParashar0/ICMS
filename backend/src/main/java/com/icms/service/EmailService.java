package com.icms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String RESEND_API_URL = "https://api.resend.com/emails";
    private static final String FROM_EMAIL = "onboarding@resend.dev";

    private void sendEmail(String toEmail, String subject, String body) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(resendApiKey);

            Map<String, Object> payload = Map.of(
                "from", FROM_EMAIL,
                "to", List.of(toEmail),
                "subject", subject,
                "text", body
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(RESEND_API_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Email sent successfully to: " + toEmail);
            } else {
                System.err.println("Email sending failed: " + response.getBody());
            }

        } catch (Exception e) {
            System.err.println("Email sending failed (non-critical): " + e.getMessage());
        }
    }

    public void sendOtpEmail(String toEmail, String name, String otp) {
        if (toEmail == null || !toEmail.contains("@") || toEmail.endsWith("@test.com")) {
            System.out.println("Skipping OTP email for: " + toEmail);
            return;
        }
        sendEmail(toEmail, "ICMS - Your Email Verification OTP", buildOtpEmailBody(name, otp));
    }

    public void sendWelcomeEmail(String toEmail, String name) {
        if (toEmail == null || !toEmail.contains("@") || toEmail.endsWith("@test.com")) {
            System.out.println("Skipping welcome email for: " + toEmail);
            return;
        }
        sendEmail(toEmail, "Welcome to ICMS - Infrastructure Complaint Management System", buildWelcomeEmailBody(name));
    }

    public void sendStatusUpdateEmail(String toEmail, String complaintId, String newStatus) {
        if (toEmail == null || !toEmail.contains("@") || toEmail.endsWith("@test.com")) {
            System.out.println("Skipping status email for: " + toEmail);
            return;
        }
        sendEmail(toEmail, "ICMS - Complaint Status Updated: " + complaintId, buildStatusEmailBody(complaintId, newStatus));
    }

    private String buildOtpEmailBody(String name, String otp) {
        return """
                Dear %s,

                Thank you for registering with ICMS - Infrastructure Complaint Management System!

                Your Email Verification OTP is:

                ==============================
                        %s
                ==============================

                This OTP is valid for 10 minutes. Do not share it with anyone.

                If you did not request this, please ignore this email.

                Regards,
                ICMS Team
                """.formatted(name, otp);
    }

    private String buildWelcomeEmailBody(String name) {
        return """
                Dear %s,

                Welcome to ICMS - Infrastructure Complaint Management System!

                Your account has been created successfully. You can now:
                - Submit infrastructure complaints
                - Track the status of your complaints
                - Get notified when your complaint is updated

                Login at: https://icms-1.onrender.com

                Regards,
                ICMS Team
                """.formatted(name);
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
}