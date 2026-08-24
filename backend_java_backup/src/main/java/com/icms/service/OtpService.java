package com.icms.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final int OTP_EXPIRY_MINUTES = 10;
    private final SecureRandom random = new SecureRandom();

    // email -> OtpEntry
    private final ConcurrentHashMap<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    private record OtpEntry(String otp, Instant expiry) {}

    /**
     * Generates a 6-digit OTP, stores it keyed by email, and returns the OTP string.
     */
    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        otpStore.put(email, new OtpEntry(otp, Instant.now().plusSeconds(OTP_EXPIRY_MINUTES * 60L)));
        return otp;
    }

    /**
     * Validates the OTP for the given email.
     * Returns true and removes the OTP on success.
     * Returns false if not found or expired.
     * Throws RuntimeException with a user-visible message on expiry / invalid.
     */
    public boolean validateAndConsume(String email, String otp) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) {
            throw new RuntimeException("No OTP found for this email. Please request a new one.");
        }
        if (Instant.now().isAfter(entry.expiry())) {
            otpStore.remove(email);
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }
        if (!entry.otp().equals(otp)) {
            throw new RuntimeException("Invalid OTP. Please try again.");
        }
        otpStore.remove(email);
        return true;
    }

    /**
     * Returns true if a (possibly expired) OTP entry exists for the email.
     */
    public boolean hasPendingOtp(String email) {
        return otpStore.containsKey(email);
    }

    /**
     * Removes the OTP entry (used on resend to clear old OTP).
     */
    public void clearOtp(String email) {
        otpStore.remove(email);
    }
}
