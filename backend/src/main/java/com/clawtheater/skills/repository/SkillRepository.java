package com.clawtheater.skills.repository;

import com.clawtheater.skills.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByOwnerUserId(Long ownerUserId);
    List<Skill> findByIsFree(Boolean isFree);
}
