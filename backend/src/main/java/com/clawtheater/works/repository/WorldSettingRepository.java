package com.clawtheater.works.repository;

import com.clawtheater.works.model.WorldSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WorldSettingRepository extends JpaRepository<WorldSetting, Long> {
    Optional<WorldSetting> findByWorkId(Long workId);
}
