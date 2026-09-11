package com.example.progettosettimana1u5.exceptions;

import java.time.Instant;

public record ErrorDTO(
        String message,
        Instant timestamp
) {
    public ErrorDTO(String message) {
        this(message, Instant.now());
    }
}
