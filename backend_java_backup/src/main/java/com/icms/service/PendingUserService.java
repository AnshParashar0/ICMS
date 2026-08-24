package com.icms.service;

import com.icms.dto.RegisterRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PendingUserService {

    private static final int EXPIRY_MINUTES = 15;

    private final ConcurrentHashMap<String, PendingEntry> pendingStore = new ConcurrentHashMap<>();

    private record PendingEntry(RegisterRequest request, Instant expiry) {}

    /**
     * Saves a pending registration keyed by email with 15-minute expiry.
     */
    public void savePending(String email, RegisterRequest request) {
        pendingStore.put(email,
            new PendingEntry(request, Instant.now().plusSeconds(EXPIRY_MINUTES * 60L)));
    }

    /**
     * Returns the pending RegisterRequest, or null if not found / expired.
     */
    public RegisterRequest getPending(String email) {
        PendingEntry entry = pendingStore.get(email);
        if (entry == null) return null;
        if (Instant.now().isAfter(entry.expiry())) {
            pendingStore.remove(email);
            return null;
        }
        return entry.request();
    }

    /**
     * Removes the pending registration entry.
     */
    public void removePending(String email) {
        pendingStore.remove(email);
    }

    /**
     * Returns true if a valid (non-expired) pending registration exists.
     */
    public boolean hasPending(String email) {
        return getPending(email) != null;
    }
}
