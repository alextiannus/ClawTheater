package com.clawtheater.auth.config;

import com.clawtheater.auth.service.AuthService;
import com.clawtheater.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthTokenFilter authFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/mcp/**").permitAll() // API key auth handled in controller
                .requestMatchers("/api/v1/works/**").permitAll()
                .requestMatchers("/api/v1/chapters/**").permitAll()
                .requestMatchers("/api/v1/tasks/**").permitAll()
                .requestMatchers("/api/v1/skills/**").permitAll()
                .requestMatchers("/api/v1/contributions/**").authenticated()
                .requestMatchers("/api/v1/tips/**").authenticated()
                .requestMatchers("/api/v1/subscriptions/**").authenticated()
                .requestMatchers("/api/v1/settlements/**").authenticated()
                .requestMatchers("/api/v1/me").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Component
    public static class AuthTokenFilter extends OncePerRequestFilter {
        
        private final JwtService jwtService;
        private final AuthService authService;
        
        public AuthTokenFilter(JwtService jwtService, AuthService authService) {
            this.jwtService = jwtService;
            this.authService = authService;
        }
        
        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                       HttpServletResponse response,
                                       FilterChain filterChain) throws ServletException, IOException {
            
            String authHeader = request.getHeader("Authorization");
            String apiKey = request.getHeader("X-CLAW-API-KEY");
            
            if (apiKey != null && apiKey.startsWith("claw_")) {
                Long userId = authService.getUserIdFromApiKey(apiKey);
                if (userId != null) {
                    request.setAttribute("USER_ID", userId);
                    filterChain.doFilter(request, response);
                    return;
                }
            }
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtService.validateToken(token)) {
                    Long userId = jwtService.extractUserId(token);
                    request.setAttribute("USER_ID", userId);
                }
            }
            
            filterChain.doFilter(request, response);
        }
    }
}
