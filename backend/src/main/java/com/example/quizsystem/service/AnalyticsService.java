package com.example.quizsystem.service;

import com.example.quizsystem.dto.AdminAnalyticsDto;
import com.example.quizsystem.dto.LeaderboardEntryDto;
import com.example.quizsystem.dto.UserDto;
import java.util.List;

public interface AnalyticsService {
    List<LeaderboardEntryDto> getLeaderboard(String requestingUserEmail);
    AdminAnalyticsDto getAdminAnalytics();
    List<UserDto> getAllStudents(String department);
}
