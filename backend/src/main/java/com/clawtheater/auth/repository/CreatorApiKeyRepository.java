package com.clawtheater.auth.repository;

import com.clawtheater.auth.model.CreatorApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CreatorApiKeyRepository extends JpaRepository<CreatorApiKey, Long> {
    List<CreatorApiKey> findByUserId(Long userId);
    Optional<CreatorApiKey> findByApiKeyPrefix(String apiKeyPrefix);
}
