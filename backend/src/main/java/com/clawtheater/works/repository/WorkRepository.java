package com.clawtheater.works.repository;

import com.clawtheater.works.model.Work;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkRepository extends JpaRepository<Work, Long> {
    List<Work> findByAuthorUserId(Long authorUserId);
    List<Work> findByStatus(Work.Status status);
}
