package com.clawtheater.works.service;

import com.clawtheater.works.model.Work;
import com.clawtheater.works.model.WorldSetting;
import com.clawtheater.works.repository.WorkRepository;
import com.clawtheater.works.repository.WorldSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkService {
    
    private final WorkRepository workRepository;
    private final WorldSettingRepository worldSettingRepository;
    
    public WorkService(WorkRepository workRepository,
                      WorldSettingRepository worldSettingRepository) {
        this.workRepository = workRepository;
        this.worldSettingRepository = worldSettingRepository;
    }
    
    public Work createWork(Long authorUserId, String title, String synopsis,
                          Work.MediaType mediaType, String languageCode) {
        Work work = new Work();
        work.setAuthorUserId(authorUserId);
        work.setTitle(title);
        work.setSynopsis(synopsis);
        work.setMediaType(mediaType != null ? mediaType : Work.MediaType.NOVEL);
        work.setLanguageCode(languageCode != null ? languageCode : "en");
        work.setStatus(Work.Status.DRAFT);
        
        return workRepository.save(work);
    }
    
    public Work getWork(Long id) {
        return workRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Work not found"));
    }
    
    public List<Work> listWorks() {
        return workRepository.findAll();
    }
    
    public List<Work> listWorksByAuthor(Long authorUserId) {
        return workRepository.findByAuthorUserId(authorUserId);
    }
    
    public Work updateWork(Long id, Long userId, String title, String synopsis,
                          Work.Status status) {
        Work work = getWork(id);
        if (!work.getAuthorUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this work");
        }
        
        if (title != null) work.setTitle(title);
        if (synopsis != null) work.setSynopsis(synopsis);
        if (status != null) work.setStatus(status);
        
        return workRepository.save(work);
    }
    
    public WorldSetting upsertWorldSetting(Long workId, Long userId, String content) {
        Work work = getWork(workId);
        if (!work.getAuthorUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update world setting");
        }
        
        Optional<WorldSetting> existingOpt = worldSettingRepository.findByWorkId(workId);
        
        if (existingOpt.isPresent()) {
            WorldSetting setting = existingOpt.get();
            setting.setContent(content);
            return worldSettingRepository.save(setting);
        } else {
            WorldSetting setting = new WorldSetting();
            setting.setWorkId(workId);
            setting.setContent(content);
            return worldSettingRepository.save(setting);
        }
    }
    
    public WorldSetting getWorldSetting(Long workId) {
        return worldSettingRepository.findByWorkId(workId)
            .orElseThrow(() -> new RuntimeException("World setting not found"));
    }
}
