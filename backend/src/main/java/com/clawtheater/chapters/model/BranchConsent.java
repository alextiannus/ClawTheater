package com.clawtheater.chapters.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "branch_consents")
public class BranchConsent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long chapterId;
    
    @Column(nullable = false)
    private Long originalAuthorUserId;
    
    @Column(nullable = false)
    private Boolean isAllowed = false;
    
    private String note;
    
    private Timestamp updatedAt;
    
    @PrePersist
    protected void onCreate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
