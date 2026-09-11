package com.example.progettosettimana1u5.services;

import com.example.progettosettimana1u5.entities.POI;
import com.example.progettosettimana1u5.exceptions.NotFoundException;
import com.example.progettosettimana1u5.payloads.poi.NewPoiDTO;
import com.example.progettosettimana1u5.payloads.poi.PoiRespDTO;
import com.example.progettosettimana1u5.repositories.POIRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class PoiService {

    private final POIRepository poiRepository;

    public PoiService(POIRepository poiRepository) {
        this.poiRepository = poiRepository;
    }

    public PoiRespDTO create(NewPoiDTO body) {
        POI poi = new POI();
        poi.setLatitudine(body.latitudine());
        poi.setLongitudine(body.longitudine());
        poi.setIndirizzo(body.indirizzo());

        return PoiRespDTO.from(poiRepository.save(poi));
    }

    public List<PoiRespDTO> getAll() {
        List<POI> pois = poiRepository.findAll();
        if (pois.isEmpty()) {
            throw new NotFoundException("Nessun POI trovato");
        }
        return pois.stream().map(PoiRespDTO::from).toList();
    }

    public PoiRespDTO getById(UUID poiId) {
        POI poi = poiRepository.findById(poiId)
                .orElseThrow(() -> new NotFoundException("POI", poiId));
        return PoiRespDTO.from(poi);
    }

    public List<PoiRespDTO> getByRiquadro(BigDecimal nord, BigDecimal sud, BigDecimal est, BigDecimal ovest) {
        List<POI> pois = poiRepository.findByLatitudineBetweenAndLongitudineBetween(sud, nord, ovest, est);
        if (pois.isEmpty()) {
            throw new NotFoundException("Nessun POI trovato nel riquadro indicato");
        }
        return pois.stream().map(PoiRespDTO::from).toList();
    }
}
