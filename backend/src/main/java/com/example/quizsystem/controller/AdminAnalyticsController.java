package com.example.quizsystem.controller;

import com.example.quizsystem.dto.AdminAnalyticsDto;
import com.example.quizsystem.dto.UserDto;
import com.example.quizsystem.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Analytics & Management", description = "Endpoints for administrator KPIs, enrollment lists, and metrics")
@SecurityRequirement(name = "BearerAuth")
public class AdminAnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping({"/api/admin/analytics", "/api/v1/admin/analytics", "/api/analytics/admin", "/api/v1/analytics/admin"})
    @Operation(summary = "Get system-wide analytics", description = "Returns exam completion counts, student pass/fail distributions, and weekly attempt activity")
    public ResponseEntity<AdminAnalyticsDto> getAdminAnalytics() {
        AdminAnalyticsDto analytics = analyticsService.getAdminAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping({"/api/admin/students", "/api/v1/admin/students"})
    @Operation(summary = "Get enrolled students list", description = "Returns all registered students with optional departmental filtering")
    public ResponseEntity<List<UserDto>> getStudents(
            @RequestParam(required = false, defaultValue = "All") String department) {
        List<UserDto> students = analyticsService.getAllStudents(department);
        return ResponseEntity.ok(students);
    }
}
