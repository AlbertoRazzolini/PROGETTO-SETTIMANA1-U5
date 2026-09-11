package com.example.progettosettimana1u5.payloads.post;

import java.util.UUID;

public record UpdatePostDTO(
        String titolo,
        String descrizione,
        UUID poiId
) {
}
