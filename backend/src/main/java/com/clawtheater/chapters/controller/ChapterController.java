package com.clawtheater.chapters.controller;

import com.clawtheater.chapters.model.BranchConsent;
import com.clawtheater.chapters.model.Chapter;
import com.clawtheater.chapters.service.ChapterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class ChapterController {
    
    private final ChapterService chapterService;
    
    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }
    
    @PostMapping("/works/{workId}/chapters")
    public ResponseEntity<Map<String, Object>> createChapter(
            @PathVariable Long workId,
            @RequestAttribute("USER_ID") Long userId,
            @RequestBody CreateChapterRequest request) {
        
        Chapter chapter = chapterService.createChapter(
            workId,
            userId,
            request.getTitle(),
            request.getBody(),
            request.getParentNodeId(),
            request.getChapterNumber()
        );
        
        return ResponseEntity.ok(chapterToResponse(chapter));
    }
    
    @GetMapping("/works/{workId}/chapters")
    public ResponseEntity<List<Map<String, Object>>> listChapters(@PathVariable Long workId) {
        List<Chapter> chapters = chapterService.getChaptersByWork(workId);
        return ResponseEntity.ok(chapters.stream()
            .map(this::chapterToResponse)
            .collect(Collectors.toList()));
    }
    
    @PostMapping("/chapters/{chapterId}/branch-consent")
    public ResponseEntity<Map<String, Object>> setBranchConsent(
            @PathVariable Long chapterId,
            @RequestAttribute("USER_ID") Long userId,
            @RequestBody BranchConsentRequest request) {
        
        BranchConsent consent = chapterService.setBranchConsent(
            chapterId,
            userId,
            request.getIsAllowed(),
            request.getNote()
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", consent.getId());
        response.put("chapterId", consent.getChapterId());
        response.put("isAllowed", consent.getIsAllowed());
        response.put("note", consent.getNote());
        response.put("updatedAt", consent.getUpdatedAt());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/chapters/{chapterId}/branch-consent")
    public ResponseEntity<Map<String, Object>> getBranchConsent(@PathVariable Long chapterId) {
        BranchConsent consent = chapterService.getBranchConsent(chapterId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", consent.getId());
        response.put("chapterId", consent.getChapterId());
        response.put("isAllowed", consent.getIsAllowed());
        response.put("note", consent.getNote());
        response.put("updatedAt", consent.getUpdatedAt());
        
        return ResponseEntity.ok(response);
    }
    
    private Map<String, Object> chapterToResponse(Chapter chapter) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", chapter.getId());
        response.put("workId", chapter.getWorkId());
        response.put("authorUserId", chapter.getAuthorUserId());
        response.put("parentNodeId", chapter.getParentNodeId());
        response.put("title", chapter.getTitle());
        response.put("body", chapter.getBody());
        response.put("chapterNumber", chapter.getChapterNumber());
        response.put("createdAt", chapter.getCreatedAt());
        return response;
    }
    
    public static class CreateChapterRequest {
        private String title;
        private String body;
        private Long parentNodeId;
        private Integer chapterNumber;
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getBody() { return body; }
        public void setBody(String body) { this.body = body; }
        public Long getParentNodeId() { return parentNodeId; }
        public void setParentNodeId(Long parentNodeId) { this.parentNodeId = parentNodeId; }
        public Integer getChapterNumber() { return chapterNumber; }
        public void setChapterNumber(Integer chapterNumber) { this.chapterNumber = chapterNumber; }
    }
    
    public static class BranchConsentRequest {
        private Boolean isAllowed;
        private String note;
        
        public Boolean getIsAllowed() { return isAllowed; }
        public void setIsAllowed(Boolean isAllowed) { this.isAllowed = isAllowed; }
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }
}
