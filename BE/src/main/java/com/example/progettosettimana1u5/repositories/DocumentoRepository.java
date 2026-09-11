package com.example.progettosettimana1u5.repositories;

import com.example.progettosettimana1u5.entities.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DocumentoRepository extends JpaRepository<Documento, UUID> {
}
