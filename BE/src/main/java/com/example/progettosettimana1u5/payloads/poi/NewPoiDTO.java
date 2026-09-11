package com.example.progettosettimana1u5.payloads.poi;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record NewPoiDTO(
        @NotNull(message = "La latitudine è obbligatoria")
        BigDecimal latitudine,

        @NotNull(message = "La longitudine è obbligatoria")
        BigDecimal longitudine,

        String indirizzo
) {
}
