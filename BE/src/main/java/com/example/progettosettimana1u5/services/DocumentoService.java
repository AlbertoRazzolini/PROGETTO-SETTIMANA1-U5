package com.example.progettosettimana1u5.services;

import com.example.progettosettimana1u5.entities.Documento;
import com.example.progettosettimana1u5.exceptions.NotFoundException;
import com.example.progettosettimana1u5.payloads.documento.DocumentoRespDTO;
import com.example.progettosettimana1u5.payloads.documento.UpdateDocumentoDTO;
import com.example.progettosettimana1u5.repositories.DocumentoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final OcrService ocrService;
    private final Path uploadDir;

    public DocumentoService(DocumentoRepository documentoRepository,
                             OcrService ocrService,
                             @Value("${app.upload.dir}") String uploadDir) {
        this.documentoRepository = documentoRepository;
        this.ocrService = ocrService;
        this.uploadDir = Path.of(uploadDir);
    }

    public DocumentoRespDTO create(String titolo, MultipartFile immagine) {
        File file = salvaFile(immagine);
        String testo = ocrService.extractText(file);

        Documento documento = new Documento();
        documento.setTitolo(titolo);
        documento.setContenuto(file.getAbsolutePath());
        documento.setGrandezza(immagine.getSize());
        documento.setTesto(testo);

        return DocumentoRespDTO.from(documentoRepository.save(documento));
    }

    public List<DocumentoRespDTO> getAll() {
        List<Documento> documenti = documentoRepository.findAll();
        if (documenti.isEmpty()) {
            throw new NotFoundException("Nessun documento trovato");
        }
        return documenti.stream().map(DocumentoRespDTO::from).toList();
    }

    public DocumentoRespDTO getById(UUID documentoId) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new NotFoundException("Documento", documentoId));
        return DocumentoRespDTO.from(documento);
    }

    public DocumentoRespDTO update(UUID documentoId, UpdateDocumentoDTO body) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new NotFoundException("Documento", documentoId));

        if (body.titolo() != null) {
            documento.setTitolo(body.titolo());
        }
        if (body.testo() != null) {
            documento.setTesto(body.testo());
        }

        return DocumentoRespDTO.from(documentoRepository.save(documento));
    }

    public void delete(UUID documentoId) {
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new NotFoundException("Documento", documentoId));
        documentoRepository.delete(documento);
    }

    private File salvaFile(MultipartFile immagine) {
        try {
            Files.createDirectories(uploadDir);
            String estensione = StringUtils.getFilenameExtension(immagine.getOriginalFilename());
            String nomeFile = UUID.randomUUID() + (estensione != null ? "." + estensione : "");
            Path destinazione = uploadDir.resolve(nomeFile);
            immagine.transferTo(destinazione);
            return destinazione.toFile();
        } catch (IOException e) {
            throw new UncheckedIOException("Errore nel salvataggio dell'immagine del documento", e);
        }
    }
}
