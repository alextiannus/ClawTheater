package com.clawtheater.subscriptions.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscriptions")
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long subscriberUserId;
    
    @Column(nullable = false)
    private Long creatorUserId;
    
    @Column(length = 64)
    private String tier = "basic";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;
    
    @Column(updatable = false)
    private Timestamp startedAt;
    
    private Timestamp endedAt;
    
    @PrePersist
    protected void onCreate() {
        startedAt = new Timestamp(System.currentTimeMillis());
    }
    
    public enum Status {
        ACTIVE, PAST_DUE, CANCELLED
    }
}
