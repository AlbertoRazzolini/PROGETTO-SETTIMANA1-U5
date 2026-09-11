package com.example.progettosettimana1u5.services;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OcrService {

    private final Tesseract tesseract;

    public OcrService(@Value("${app.ocr.tessdata}") String tessdataPath,
                       @Value("${app.ocr.lang}") String lang) {
        this.tesseract = new Tesseract();
        this.tesseract.setDatapath(tessdataPath);
        this.tesseract.setLanguage(lang);
    }

    public String extractText(File file) {
        try {
            return tesseract.doOCR(file);
        } catch (TesseractException e) {
            throw new IllegalStateException("Errore durante l'OCR del documento: " + e.getMessage(), e);
        }
    }
}
