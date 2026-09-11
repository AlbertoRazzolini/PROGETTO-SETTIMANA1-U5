package com.example.progettosettimana1u5.repositories;

import com.example.progettosettimana1u5.entities.POI;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface POIRepository extends JpaRepository<POI, UUID> {
    List<POI> findByLatitudineBetweenAndLongitudineBetween(
            BigDecimal latitudineMin, BigDecimal latitudineMax,
            BigDecimal longitudineMin, BigDecimal longitudineMax
    );
}
