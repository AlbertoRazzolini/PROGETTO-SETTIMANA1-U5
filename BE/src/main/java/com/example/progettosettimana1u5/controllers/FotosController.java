package com.example.progettosettimana1u5.controllers;

import com.example.progettosettimana1u5.payloads.foto.FotoRespDTO;
import com.example.progettosettimana1u5.payloads.foto.NewFotoDTO;
import com.example.progettosettimana1u5.services.FotoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/fotos")
public class FotosController {

    private final FotoService fotoService;

    public FotosController(FotoService fotoService) {
        this.fotoService = fotoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FotoRespDTO create(@RequestBody @Valid NewFotoDTO body) {
        return fotoService.create(body);
    }
}
