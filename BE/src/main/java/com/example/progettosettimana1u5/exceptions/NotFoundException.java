package com.example.progettosettimana1u5.exceptions;

import java.util.UUID;

public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(String entity, UUID id) {
        super(entity + " con id " + id + " non trovato");
    }
}
