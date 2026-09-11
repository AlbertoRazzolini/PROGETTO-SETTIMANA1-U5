package com.example.progettosettimana1u5.payloads.foto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record NewFotoDTO(
        @NotBlank(message = "Il contenuto (url) della foto è obbligatorio")
        String contenuto,

        @NotNull(message = "La grandezza della foto è obbligatoria")
        Long grandezza,

        @NotNull(message = "Il postId è obbligatorio")
        UUID postId
) {
}
