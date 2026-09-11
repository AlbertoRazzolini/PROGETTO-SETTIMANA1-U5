package com.example.progettosettimana1u5.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        name = "poi",
        indexes = {
                @Index(name = "idx_poi_latitudine", columnList = "latitudine"),
                @Index(name = "idx_poi_longitudine", columnList = "longitudine")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class POI {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false, precision = 8, scale = 6)
    private BigDecimal latitudine;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal longitudine;

    @Column(nullable = true)
    private String indirizzo;
}
