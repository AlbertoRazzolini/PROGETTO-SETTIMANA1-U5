package com.example.progettosettimana1u5.payloads.poi;

import com.example.progettosettimana1u5.entities.POI;

import java.math.BigDecimal;
import java.util.UUID;

public record PoiRespDTO(
        UUID id,
        BigDecimal latitudine,
        BigDecimal longitudine,
        String indirizzo
) {
    public static PoiRespDTO from(POI poi) {
        if (poi == null) return null;
        return new PoiRespDTO(poi.getId(), poi.getLatitudine(), poi.getLongitudine(), poi.getIndirizzo());
    }
}
