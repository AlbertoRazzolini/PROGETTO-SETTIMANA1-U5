package com.example.progettosettimana1u5.payloads.post;

import com.example.progettosettimana1u5.entities.Post;
import com.example.progettosettimana1u5.payloads.foto.FotoRespDTO;
import com.example.progettosettimana1u5.payloads.poi.PoiRespDTO;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PostRespDTO(
        UUID id,
        String titolo,
        String descrizione,
        Instant createdAt,
        PoiRespDTO poi,
        List<FotoRespDTO> foto
) {
    public static PostRespDTO from(Post post, List<FotoRespDTO> foto) {
        return new PostRespDTO(
                post.getId(),
                post.getTitolo(),
                post.getDescrizione(),
                post.getCreatedAt(),
                PoiRespDTO.from(post.getPoi()),
                foto
        );
    }
}
