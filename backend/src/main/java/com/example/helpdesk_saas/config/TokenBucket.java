package com.example.helpdesk_saas.config;

import lombok.Data;

@Data
class TokenBucket {
    private int capacity;
    private double refillRate; // tokens per second
    private double tokens;
    private long lastRefill;

    public TokenBucket(int capacity, double refillRate) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.tokens = capacity;
        this.lastRefill = System.nanoTime();
    }

    public synchronized boolean allowRequest() {
        refill();
        if (tokens >= 1) {
            tokens -= 1;
            return true;
        }
        return false;
    }

    private void refill() {
        long now = System.nanoTime();
        double seconds = (now - lastRefill) / 1_000_000_000.0;
        double refillTokens = seconds * refillRate;
        tokens = Math.min(capacity, tokens + refillTokens);
        lastRefill = now;
    }
}