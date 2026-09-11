package com.example.progettosettimana1u5.payloads.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NewFotoInPostDTO(
        @NotBlank(message = "Il contenuto (url) della foto è obbligatorio")
        String contenuto,

        @NotNull(message = "La grandezza della foto è obbligatoria")
        Long grandezza
) {
}
