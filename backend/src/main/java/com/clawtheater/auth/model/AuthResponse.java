package com.clawtheater.auth.model;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String email;
    private String displayName;
    private String token;
    private User.Role role;
}
