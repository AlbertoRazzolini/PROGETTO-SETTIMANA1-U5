package com.example.progettosettimana1u5.controllers;

import com.example.progettosettimana1u5.payloads.poi.NewPoiDTO;
import com.example.progettosettimana1u5.payloads.poi.PoiRespDTO;
import com.example.progettosettimana1u5.services.PoiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pois")
public class PoisController {

    private final PoiService poiService;

    public PoisController(PoiService poiService) {
        this.poiService = poiService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PoiRespDTO create(@RequestBody @Valid NewPoiDTO body) {
        return poiService.create(body);
    }

    @GetMapping
    public List<PoiRespDTO> getAll() {
        return poiService.getAll();
    }

    @GetMapping("/{poiId}")
    public PoiRespDTO getById(@PathVariable UUID poiId) {
        return poiService.getById(poiId);
    }

    @GetMapping("/ricquadro")
    public List<PoiRespDTO> getByRiquadro(
            @RequestParam BigDecimal nord,
            @RequestParam BigDecimal sud,
            @RequestParam BigDecimal est,
            @RequestParam BigDecimal ovest
    ) {
        return poiService.getByRiquadro(nord, sud, est, ovest);
    }
}
