package com.clawtheater.chapters.service;

import com.clawtheater.chapters.model.BranchConsent;
import com.clawtheater.chapters.model.Chapter;
import com.clawtheater.chapters.repository.BranchConsentRepository;
import com.clawtheater.chapters.repository.ChapterRepository;
import com.clawtheater.works.model.Work;
import com.clawtheater.works.repository.WorkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ChapterService {
    
    private final ChapterRepository chapterRepository;
    private final BranchConsentRepository branchConsentRepository;
    private final WorkRepository workRepository;
    
    public ChapterService(ChapterRepository chapterRepository,
                         BranchConsentRepository branchConsentRepository,
                         WorkRepository workRepository) {
        this.chapterRepository = chapterRepository;
        this.branchConsentRepository = branchConsentRepository;
        this.workRepository = workRepository;
    }
    
    public Chapter createChapter(Long workId, Long authorUserId, String title,
                                String body, Long parentNodeId, Integer chapterNumber) {
        Work work = workRepository.findById(workId)
            .orElseThrow(() -> new RuntimeException("Work not found"));
        
        if (!work.getAuthorUserId().equals(authorUserId)) {
            throw new RuntimeException("Not authorized to create chapter for this work");
        }
        
        Chapter chapter = new Chapter();
        chapter.setWorkId(workId);
        chapter.setAuthorUserId(authorUserId);
        chapter.setTitle(title);
        chapter.setBody(body);
        chapter.setParentNodeId(parentNodeId);
        chapter.setChapterNumber(chapterNumber != null ? chapterNumber : 0);
        
        return chapterRepository.save(chapter);
    }
    
    public List<Chapter> getChaptersByWork(Long workId) {
        return chapterRepository.findByWorkIdOrderByChapterNumberAsc(workId);
    }
    
    public Chapter getChapter(Long id) {
        return chapterRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Chapter not found"));
    }
    
    public BranchConsent setBranchConsent(Long chapterId, Long originalAuthorUserId,
                                         Boolean isAllowed, String note) {
        Chapter chapter = getChapter(chapterId);
        
        // Only original author can set consent
        if (!chapter.getAuthorUserId().equals(originalAuthorUserId)) {
            throw new RuntimeException("Only original author can set branch consent");
        }
        
        Optional<BranchConsent> existingOpt = branchConsentRepository.findByChapterId(chapterId);
        
        if (existingOpt.isPresent()) {
            BranchConsent consent = existingOpt.get();
            consent.setIsAllowed(isAllowed);
            if (note != null) consent.setNote(note);
            return branchConsentRepository.save(consent);
        } else {
            BranchConsent consent = new BranchConsent();
            consent.setChapterId(chapterId);
            consent.setOriginalAuthorUserId(originalAuthorUserId);
            consent.setIsAllowed(isAllowed);
            consent.setNote(note);
            return branchConsentRepository.save(consent);
        }
    }
    
    public BranchConsent getBranchConsent(Long chapterId) {
        return branchConsentRepository.findByChapterId(chapterId)
            .orElseThrow(() -> new RuntimeException("Branch consent not found"));
    }
    
    public boolean isBranchAllowed(Long chapterId) {
        return branchConsentRepository.findByChapterId(chapterId)
            .map(BranchConsent::getIsAllowed)
            .orElse(false);
    }
}
