package com.example.quizsystem.service.impl;

import com.example.quizsystem.dto.AuthRequest;
import com.example.quizsystem.dto.AuthResponse;
import com.example.quizsystem.dto.RegisterRequest;
import com.example.quizsystem.entity.Role;
import com.example.quizsystem.entity.User;
import com.example.quizsystem.exception.BadRequestException;
import com.example.quizsystem.exception.DuplicateResourceException;
import com.example.quizsystem.exception.UnauthorizedException;
import com.example.quizsystem.repository.UserRepository;
import com.example.quizsystem.security.JwtUtils;
import com.example.quizsystem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists.");
        }

        if (request.getStudentId() != null && userRepository.existsByStudentId(request.getStudentId())) {
            throw new DuplicateResourceException("A student with ID " + request.getStudentId() + " is already registered.");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getStudentId(),
                request.getDepartment() != null ? request.getDepartment() : "Computer Science & Engineering",
                Role.ROLE_STUDENT
        );

        User saved = userRepository.save(user);

        String token = jwtUtils.generateToken(saved.getEmail(), saved.getRole(), saved.getId());

        return new AuthResponse(
                token,
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getStudentId(),
                saved.getDepartment(),
                saved.getRole()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole(), user.getId());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getStudentId(),
                user.getDepartment(),
                user.getRole()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("User is not authenticated.");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User account not found."));
    }
}
