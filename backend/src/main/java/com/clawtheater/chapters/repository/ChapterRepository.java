package com.clawtheater.chapters.repository;

import com.clawtheater.chapters.model.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByWorkIdOrderByChapterNumberAsc(Long workId);
    List<Chapter> findByAuthorUserId(Long authorUserId);
    List<Chapter> findByParentNodeId(Long parentNodeId);
}
