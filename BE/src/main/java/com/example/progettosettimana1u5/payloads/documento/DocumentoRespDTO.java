package com.example.progettosettimana1u5.payloads.documento;

import com.example.progettosettimana1u5.entities.Documento;

import java.time.Instant;
import java.util.UUID;

public record DocumentoRespDTO(
        UUID id,
        String titolo,
        String contenuto,
        String testo,
        String immagineBase64,
        Long grandezza,
        Instant createdAt
) {
    public static DocumentoRespDTO from(Documento documento) {
        return new DocumentoRespDTO(
                documento.getId(),
                documento.getTitolo(),
                documento.getContenuto(),
                documento.getTesto(),
                documento.getImmagineBase64(),
                documento.getGrandezza(),
                documento.getCreatedAt()
        );
    }
}
