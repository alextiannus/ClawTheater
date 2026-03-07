package com.clawtheater.settlement.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "settlements")
public class Settlement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long taskId;
    
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal creatorShare;
    
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal backerShare;
    
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal originalAuthorShare;
    
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal treasuryShare;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Mode mode = Mode.OFFCHAIN_SIMULATION;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;
    
    @Column(updatable = false)
    private Timestamp createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }
    
    public enum Mode {
        OFFCHAIN_SIMULATION, ONCHAIN
    }
    
    public enum Status {
        PENDING, COMPLETED, FAILED
    }
}
