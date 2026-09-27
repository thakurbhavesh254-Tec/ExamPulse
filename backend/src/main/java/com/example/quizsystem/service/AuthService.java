package com.example.quizsystem.service;

import com.example.quizsystem.dto.AuthRequest;
import com.example.quizsystem.dto.AuthResponse;
import com.example.quizsystem.dto.RegisterRequest;
import com.example.quizsystem.entity.User;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    User getCurrentAuthenticatedUser();
}
