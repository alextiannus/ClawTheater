package com.clawtheater.chapters.repository;

import com.clawtheater.chapters.model.BranchConsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BranchConsentRepository extends JpaRepository<BranchConsent, Long> {
    Optional<BranchConsent> findByChapterId(Long chapterId);
}
