package com.example.progettosettimana1u5.repositories;

import com.example.progettosettimana1u5.entities.Foto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FotoRepository extends JpaRepository<Foto, UUID> {
    List<Foto> findByPostId(UUID postId);
}
