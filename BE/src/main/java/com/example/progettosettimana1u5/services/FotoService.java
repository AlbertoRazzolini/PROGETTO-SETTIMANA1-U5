package com.example.progettosettimana1u5.services;

import com.example.progettosettimana1u5.entities.Foto;
import com.example.progettosettimana1u5.entities.Post;
import com.example.progettosettimana1u5.exceptions.NotFoundException;
import com.example.progettosettimana1u5.payloads.foto.FotoRespDTO;
import com.example.progettosettimana1u5.payloads.foto.NewFotoDTO;
import com.example.progettosettimana1u5.repositories.FotoRepository;
import com.example.progettosettimana1u5.repositories.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class FotoService {

    private final FotoRepository fotoRepository;
    private final PostRepository postRepository;

    public FotoService(FotoRepository fotoRepository, PostRepository postRepository) {
        this.fotoRepository = fotoRepository;
        this.postRepository = postRepository;
    }

    @Transactional
    public FotoRespDTO create(NewFotoDTO body) {
        Post post = postRepository.findById(body.postId())
                .orElseThrow(() -> new NotFoundException("Post", body.postId()));

        Foto foto = new Foto();
        foto.setContenuto(body.contenuto());
        foto.setGrandezza(body.grandezza());
        foto.setPost(post);

        return FotoRespDTO.from(fotoRepository.save(foto));
    }

    public List<FotoRespDTO> getAll() {
        List<Foto> foto = fotoRepository.findAll();
        if (foto.isEmpty()) {
            throw new NotFoundException("Nessuna foto trovata");
        }
        return foto.stream().map(FotoRespDTO::from).toList();
    }

    public FotoRespDTO getById(UUID fotoId) {
        Foto foto = fotoRepository.findById(fotoId)
                .orElseThrow(() -> new NotFoundException("Foto", fotoId));
        return FotoRespDTO.from(foto);
    }
}
