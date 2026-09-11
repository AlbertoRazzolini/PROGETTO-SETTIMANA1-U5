package com.example.progettosettimana1u5.services;

import com.example.progettosettimana1u5.entities.Foto;
import com.example.progettosettimana1u5.entities.POI;
import com.example.progettosettimana1u5.entities.Post;
import com.example.progettosettimana1u5.exceptions.NotFoundException;
import com.example.progettosettimana1u5.payloads.foto.FotoRespDTO;
import com.example.progettosettimana1u5.payloads.post.NewFotoInPostDTO;
import com.example.progettosettimana1u5.payloads.post.NewPostDTO;
import com.example.progettosettimana1u5.payloads.post.PostRespDTO;
import com.example.progettosettimana1u5.payloads.post.UpdatePostDTO;
import com.example.progettosettimana1u5.repositories.FotoRepository;
import com.example.progettosettimana1u5.repositories.POIRepository;
import com.example.progettosettimana1u5.repositories.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final POIRepository poiRepository;
    private final FotoRepository fotoRepository;

    public PostService(PostRepository postRepository, POIRepository poiRepository, FotoRepository fotoRepository) {
        this.postRepository = postRepository;
        this.poiRepository = poiRepository;
        this.fotoRepository = fotoRepository;
    }

    @Transactional
    public PostRespDTO create(NewPostDTO body) {
        Post post = new Post();
        post.setTitolo(body.titolo());
        post.setDescrizione(body.descrizione());

        if (body.poiId() != null) {
            POI poi = poiRepository.findById(body.poiId())
                    .orElseThrow(() -> new NotFoundException("POI", body.poiId()));
            post.setPoi(poi);
        }

        Post saved = postRepository.save(post);

        List<FotoRespDTO> fotoRespDTOs = List.of();
        if (body.foto() != null && !body.foto().isEmpty()) {
            fotoRespDTOs = body.foto().stream()
                    .map(f -> creaFoto(saved, f))
                    .map(FotoRespDTO::from)
                    .toList();
        }

        return PostRespDTO.from(saved, fotoRespDTOs);
    }

    public List<PostRespDTO> getAll() {
        List<Post> posts = postRepository.findAll();
        if (posts.isEmpty()) {
            throw new NotFoundException("Nessun post trovato");
        }
        return posts.stream()
                .map(post -> PostRespDTO.from(post, getFotoByPost(post.getId())))
                .toList();
    }

    public PostRespDTO getById(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post", postId));
        return PostRespDTO.from(post, getFotoByPost(post.getId()));
    }

    @Transactional
    public PostRespDTO update(UUID postId, UpdatePostDTO body) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post", postId));

        if (body.titolo() != null) {
            post.setTitolo(body.titolo());
        }
        if (body.descrizione() != null) {
            post.setDescrizione(body.descrizione());
        }
        if (body.poiId() != null) {
            POI poi = poiRepository.findById(body.poiId())
                    .orElseThrow(() -> new NotFoundException("POI", body.poiId()));
            post.setPoi(poi);
        }

        Post updated = postRepository.save(post);
        return PostRespDTO.from(updated, getFotoByPost(updated.getId()));
    }

    @Transactional
    public void delete(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post", postId));
        fotoRepository.deleteAll(fotoRepository.findByPostId(postId));
        postRepository.delete(post);
    }

    private List<FotoRespDTO> getFotoByPost(UUID postId) {
        return fotoRepository.findByPostId(postId).stream()
                .map(FotoRespDTO::from)
                .toList();
    }

    private Foto creaFoto(Post post, NewFotoInPostDTO body) {
        Foto foto = new Foto();
        foto.setContenuto(body.contenuto());
        foto.setGrandezza(body.grandezza());
        foto.setPost(post);
        return fotoRepository.save(foto);
    }
}
