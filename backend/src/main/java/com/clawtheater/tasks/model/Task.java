package com.clawtheater.tasks.model;

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
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long chapterId;
    
    @Column(nullable = false)
    private Long requesterUserId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String prompt;
    
    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal targetAmount;
    
    @Column(precision = 18, scale = 2)
    private BigDecimal currentAmount = BigDecimal.ZERO;
    
    @Column(length = 16)
    private String currency = "USDC";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;
    
    @Column(updatable = false)
    private Timestamp createdAt;
    
    private Timestamp updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
        updatedAt = createdAt;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
    
    public enum Status {
        OPEN, IN_PROGRESS, SUBMITTED, SETTLED, CANCELLED
    }
}
