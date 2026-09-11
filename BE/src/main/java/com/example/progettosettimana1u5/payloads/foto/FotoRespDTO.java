package com.example.progettosettimana1u5.payloads.foto;

import com.example.progettosettimana1u5.entities.Foto;

import java.time.Instant;
import java.util.UUID;

public record FotoRespDTO(
        UUID id,
        String contenuto,
        Long grandezza,
        Instant createdAt,
        UUID postId
) {
    public static FotoRespDTO from(Foto foto) {
        return new FotoRespDTO(
                foto.getId(),
                foto.getContenuto(),
                foto.getGrandezza(),
                foto.getCreatedAt(),
                foto.getPost().getId()
        );
    }
}
