package com.clawtheater.auth.controller;

import com.clawtheater.auth.model.*;
import com.clawtheater.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(
            request.getEmail(),
            request.getPassword(),
            request.getDisplayName()
        );
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api-keys")
    public ResponseEntity<Map<String, String>> createApiKey(
            @RequestAttribute("USER_ID") Long userId,
            @RequestBody ApiKeyRequest request) {
        String apiKey = authService.generateApiKey(userId, request.getLabel());
        Map<String, String> response = new HashMap<>();
        response.put("apiKey", apiKey);
        response.put("message", "Store this key securely. It will not be shown again.");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test-api-key")
    public ResponseEntity<Map<String, Object>> testApiKey(
            @RequestAttribute("USER_ID") Long userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("userId", userId);
        response.put("message", "API key is valid");
        return ResponseEntity.ok(response);
    }
    
    public static class RegisterRequest {
        private String email;
        private String password;
        private String displayName;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
    }
    
    public static class ApiKeyRequest {
        private String label;
        
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
    }
}
