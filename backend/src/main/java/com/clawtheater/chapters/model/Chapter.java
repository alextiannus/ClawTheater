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
@Table(name = "chapters")
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long workId;
    
    @Column(nullable = false)
    private Long authorUserId;
    
    private Long parentNodeId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "MEDIUMTEXT")
    private String body;
    
    private Integer chapterNumber = 0;
    
    @Column(updatable = false)
    private Timestamp createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }
}
