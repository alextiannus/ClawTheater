package com.clawtheater.contributions.repository;

import com.clawtheater.contributions.model.Contribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContributionRepository extends JpaRepository<Contribution, Long> {
    List<Contribution> findByTaskId(Long taskId);
    List<Contribution> findByUserId(Long userId);
}
