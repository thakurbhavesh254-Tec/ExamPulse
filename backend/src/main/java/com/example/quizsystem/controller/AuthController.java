package com.example.quizsystem.controller;

import com.example.quizsystem.dto.AuthRequest;
import com.example.quizsystem.dto.AuthResponse;
import com.example.quizsystem.dto.RegisterRequest;
import com.example.quizsystem.entity.User;
import com.example.quizsystem.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/auth", "/api/v1/auth"})
@Tag(name = "Authentication", description = "Registration, Login, and Session API")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new student candidate", description = "Creates a new student profile with role ROLE_STUDENT and returns JWT token.")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates student or faculty admin and returns JWT Bearer token.")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<User> getCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        // Clear hashed password before sending profile
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
