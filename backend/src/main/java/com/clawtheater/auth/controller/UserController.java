package com.clawtheater.auth.controller;

import com.clawtheater.auth.model.User;
import com.clawtheater.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    
    private final AuthService authService;
    
    public UserController(AuthService authService) {
        this.authService = authService;
    }
    
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @RequestAttribute("USER_ID") Long userId) {
        User user = authService.getCurrentUser(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("displayName", user.getDisplayName());
        response.put("role", user.getRole().name());
        response.put("walletAddress", user.getWalletAddress());
        response.put("createdAt", user.getCreatedAt());
        
        return ResponseEntity.ok(response);
    }
}
