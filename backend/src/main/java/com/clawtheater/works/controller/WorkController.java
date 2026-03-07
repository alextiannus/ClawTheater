package com.clawtheater.works.controller;

import com.clawtheater.works.model.Work;
import com.clawtheater.works.model.WorldSetting;
import com.clawtheater.works.service.WorkService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/works")
public class WorkController {
    
    private final WorkService workService;
    
    public WorkController(WorkService workService) {
        this.workService = workService;
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createWork(
            @RequestAttribute("USER_ID") Long userId,
            @RequestBody CreateWorkRequest request) {
        
        Work work = workService.createWork(
            userId,
            request.getTitle(),
            request.getSynopsis(),
            request.getMediaType() != null ? Work.MediaType.valueOf(request.getMediaType()) : null,
            request.getLanguageCode()
        );
        
        return ResponseEntity.ok(workToResponse(work));
    }
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listWorks() {
        List<Work> works = workService.listWorks();
        return ResponseEntity.ok(works.stream()
            .map(this::workToResponse)
            .collect(Collectors.toList()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getWork(@PathVariable Long id) {
        Work work = workService.getWork(id);
        return ResponseEntity.ok(workToResponse(work));
    }
    
    @PostMapping("/{id}/world")
    public ResponseEntity<Map<String, Object>> upsertWorldSetting(
            @PathVariable Long id,
            @RequestAttribute("USER_ID") Long userId,
            @RequestBody WorldSettingRequest request) {
        
        WorldSetting setting = workService.upsertWorldSetting(id, userId, request.getContent());
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", setting.getId());
        response.put("workId", setting.getWorkId());
        response.put("content", setting.getContent());
        response.put("updatedAt", setting.getUpdatedAt());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/world")
    public ResponseEntity<Map<String, Object>> getWorldSetting(@PathVariable Long id) {
        WorldSetting setting = workService.getWorldSetting(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", setting.getId());
        response.put("workId", setting.getWorkId());
        response.put("content", setting.getContent());
        response.put("updatedAt", setting.getUpdatedAt());
        
        return ResponseEntity.ok(response);
    }
    
    private Map<String, Object> workToResponse(Work work) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", work.getId());
        response.put("authorUserId", work.getAuthorUserId());
        response.put("mediaType", work.getMediaType().name());
        response.put("title", work.getTitle());
        response.put("synopsis", work.getSynopsis());
        response.put("languageCode", work.getLanguageCode());
        response.put("status", work.getStatus().name());
        response.put("createdAt", work.getCreatedAt());
        response.put("updatedAt", work.getUpdatedAt());
        return response;
    }
    
    public static class CreateWorkRequest {
        private String title;
        private String synopsis;
        private String mediaType;
        private String languageCode;
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getSynopsis() { return synopsis; }
        public void setSynopsis(String synopsis) { this.synopsis = synopsis; }
        public String getMediaType() { return mediaType; }
        public void setMediaType(String mediaType) { this.mediaType = mediaType; }
        public String getLanguageCode() { return languageCode; }
        public void setLanguageCode(String languageCode) { this.languageCode = languageCode; }
    }
    
    public static class WorldSettingRequest {
        private String content;
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
