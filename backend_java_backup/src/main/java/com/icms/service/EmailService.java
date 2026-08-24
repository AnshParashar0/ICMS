package com.icms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Map;

@Service
public class EmailService {

    @Value("${gmail.client.id}")
    private String clientId;

    @Value("${gmail.client.secret}")
    private String clientSecret;

    @Value("${gmail.refresh.token}")
    private String refreshToken;

    @Value("${gmail.from.email}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    // ── Get fresh access token using refresh token ─────────────────────────
    private String getAccessToken() {
        String tokenUrl = "https://oauth2.googleapis.com/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", refreshToken);
        body.add("grant_type", "refresh_token");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return (String) response.getBody().get("access_token");
        }
        throw new RuntimeException("Failed to get access token");
    }

    // ── Send email via Gmail API ───────────────────────────────────────────
    private void sendEmail(String toEmail, String subject, String body) {
        try {
            String accessToken = getAccessToken();

            // Build RFC 2822 email format
            String emailContent = "From: " + fromEmail + "\r\n" +
                    "To: " + toEmail + "\r\n" +
                    "Subject: " + subject + "\r\n" +
                    "Content-Type: text/plain; charset=utf-8\r\n" +
                    "\r\n" +
                    body;

            // Base64 encode
            String encodedEmail = Base64.getUrlEncoder()
                    .encodeToString(emailContent.getBytes());

            // Call Gmail API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);

            Map<String, String> payload = Map.of("raw", encodedEmail);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
                    request,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Email sent successfully to: " + toEmail);
            } else {
                System.err.println("Email sending failed: " + response.getBody());
            }

        } catch (Exception e) {
            System.err.println("Email sending failed (non-critical): " + e.getMessage());
        }
    }

    // ── Public methods ─────────────────────────────────────────────────────

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

    // ── Email body builders ────────────────────────────────────────────────

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