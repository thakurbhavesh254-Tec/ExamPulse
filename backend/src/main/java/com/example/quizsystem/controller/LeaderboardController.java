package com.example.quizsystem.controller;

import com.example.quizsystem.dto.LeaderboardEntryDto;
import com.example.quizsystem.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/leaderboard", "/api/v1/leaderboard", "/api/analytics/leaderboard", "/api/v1/analytics/leaderboard"})
@Tag(name = "Leaderboard", description = "Endpoints for academic rank lists and top scholar standings")
public class LeaderboardController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping
    @Operation(summary = "Get academic leaderboard", description = "Retrieves ranking of candidates ordered by aggregate points and average score")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard(Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : null;
        List<LeaderboardEntryDto> leaderboard = analyticsService.getLeaderboard(userEmail);
        return ResponseEntity.ok(leaderboard);
    }
}
