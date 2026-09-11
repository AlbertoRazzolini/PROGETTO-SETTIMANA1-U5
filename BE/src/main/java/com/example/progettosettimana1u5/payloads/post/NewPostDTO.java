package com.example.progettosettimana1u5.payloads.post;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

public record NewPostDTO(
        @NotBlank(message = "Il titolo è obbligatorio")
        String titolo,

        @NotBlank(message = "La descrizione è obbligatoria")
        String descrizione,

        UUID poiId,

        @Valid
        List<NewFotoInPostDTO> foto
) {
}
