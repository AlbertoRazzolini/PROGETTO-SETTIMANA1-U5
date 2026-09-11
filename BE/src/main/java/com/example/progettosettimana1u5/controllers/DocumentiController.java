package com.example.progettosettimana1u5.controllers;

import com.example.progettosettimana1u5.payloads.documento.DocumentoRespDTO;
import com.example.progettosettimana1u5.payloads.documento.UpdateDocumentoDTO;
import com.example.progettosettimana1u5.services.DocumentoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documenti")
public class DocumentiController {

    private final DocumentoService documentoService;

    public DocumentiController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public DocumentoRespDTO create(@RequestParam String titolo, @RequestParam MultipartFile immagine) {
        return documentoService.create(titolo, immagine);
    }

    @GetMapping
    public List<DocumentoRespDTO> getAll() {
        return documentoService.getAll();
    }

    @GetMapping("/{documentiId}")
    public DocumentoRespDTO getById(@PathVariable UUID documentiId) {
        return documentoService.getById(documentiId);
    }

    @PatchMapping("/{documentiId}")
    public DocumentoRespDTO update(@PathVariable UUID documentiId, @RequestBody UpdateDocumentoDTO body) {
        return documentoService.update(documentiId, body);
    }

    @DeleteMapping("/{documentiId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID documentiId) {
        documentoService.delete(documentiId);
    }
}
