package com.icms.controller;

import com.icms.config.JwtUtil;
import com.icms.dto.LoginRequest;
import com.icms.dto.RegisterRequest;
import com.icms.dto.ResendOtpRequest;
import com.icms.dto.VerifyOtpRequest;
import com.icms.model.User;
import com.icms.service.EmailService;
import com.icms.service.OtpService;
import com.icms.service.PendingUserService;
import com.icms.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final OtpService otpService;
    private final PendingUserService pendingUserService;
    private final EmailService emailService;

    // ── REGISTER — stores pending data and sends OTP ──────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Check if email already registered in DB
            if (userService.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email already exists"));
            }

            // Save registration data temporarily
            pendingUserService.savePending(request.getEmail(), request);

            // Generate and send OTP
            String otp = otpService.generateOtp(request.getEmail());
            emailService.sendOtpEmail(request.getEmail(), request.getName(), otp);

            return ResponseEntity.ok(Map.of(
                    "message", "OTP sent to your email. Please verify to complete registration.",
                    "email", request.getEmail()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ── VERIFY OTP — validates OTP and creates the user account ───────────
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            // Validate OTP (throws on failure)
            otpService.validateAndConsume(request.getEmail(), request.getOtp());

            // Get pending registration data
            RegisterRequest pending = pendingUserService.getPending(request.getEmail());
            if (pending == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Registration session expired. Please register again."));
            }

            // Create user account
            User user = userService.register(pending);
            pendingUserService.removePending(request.getEmail());

            return ResponseEntity.ok(Map.of(
                    "message", "Account created successfully! Please login.",
                    "userId", user.getId()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ── RESEND OTP — regenerates and resends OTP for a pending registration ─
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody ResendOtpRequest request) {
        try {
            if (!pendingUserService.hasPending(request.getEmail())) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "No pending registration found. Please register again."));
            }

            RegisterRequest pending = pendingUserService.getPending(request.getEmail());
            otpService.clearOtp(request.getEmail());
            String otp = otpService.generateOtp(request.getEmail());
            emailService.sendOtpEmail(request.getEmail(), pending.getName(), otp);

            return ResponseEntity.ok(Map.of("message", "OTP resent to your email."));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ── LOGIN ──────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = userService.getUserByEmail(request.getEmail());
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", Map.of(
                            "id", user.getId(),
                            "name", user.getName(),
                            "email", user.getEmail(),
                            "role", user.getRole().name(),
                            "contactNumber", user.getContactNumber()
                    )
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
    }
}