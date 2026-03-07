package com.clawtheater.auth.service;

import com.clawtheater.auth.model.*;
import com.clawtheater.auth.repository.UserRepository;
import com.clawtheater.auth.repository.CreatorApiKeyRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final CreatorApiKeyRepository creatorApiKeyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    public AuthService(UserRepository userRepository,
                      CreatorApiKeyRepository creatorApiKeyRepository,
                      PasswordEncoder passwordEncoder,
                      JwtService jwtService) {
        this.userRepository = userRepository;
        this.creatorApiKeyRepository = creatorApiKeyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }
    
    public AuthResponse register(String email, String password, String displayName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setDisplayName(displayName);
        user.setRole(User.Role.READER);
        
        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getId(), savedUser.getEmail());
        
        return new AuthResponse(
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getDisplayName(),
            token,
            savedUser.getRole()
        );
    }
    
    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getDisplayName(),
            token,
            user.getRole()
        );
    }
    
    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public String generateApiKey(Long userId, String label) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate API key (prefix + random secret)
        String randomPart = generateRandomString(32);
        String apiKey = "claw_" + randomPart;
        String prefix = apiKey.substring(0, 10);
        
        CreatorApiKey creatorApiKey = new CreatorApiKey();
        creatorApiKey.setUserId(userId);
        creatorApiKey.setApiKeyHash(passwordEncoder.encode(apiKey));
        creatorApiKey.setApiKeyPrefix(prefix);
        creatorApiKey.setLabel(label);
        
        creatorApiKeyRepository.save(creatorApiKey);
        
        return apiKey; // Return full key once (never stored)
    }
    
    public boolean validateApiKey(String apiKey) {
        String prefix = apiKey.length() >= 10 ? apiKey.substring(0, 10) : apiKey;
        Optional<CreatorApiKey> keyOpt = creatorApiKeyRepository.findByApiKeyPrefix(prefix);
        
        if (keyOpt.isEmpty()) {
            return false;
        }
        
        return passwordEncoder.matches(apiKey, keyOpt.get().getApiKeyHash());
    }
    
    public Long getUserIdFromApiKey(String apiKey) {
        String prefix = apiKey.length() >= 10 ? apiKey.substring(0, 10) : apiKey;
        Optional<CreatorApiKey> keyOpt = creatorApiKeyRepository.findByApiKeyPrefix(prefix);
        
        if (keyOpt.isEmpty() || !passwordEncoder.matches(apiKey, keyOpt.get().getApiKeyHash())) {
            return null;
        }
        
        return keyOpt.get().getUserId();
    }
    
    private String generateRandomString(int length) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[length];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes).substring(0, length);
    }
}
