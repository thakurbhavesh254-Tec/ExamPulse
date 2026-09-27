package com.example.quizsystem.controller;

import com.example.quizsystem.dto.AttemptResultDto;
import com.example.quizsystem.dto.StudentPerformanceDto;
import com.example.quizsystem.service.AttemptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Results & Analytics", description = "Endpoints for exam results, attempt history, performance trends, and administrative score audit")
@SecurityRequirement(name = "BearerAuth")
public class ResultController {

    @Autowired
    private AttemptService attemptService;

    @GetMapping({"/api/results/{attemptId}", "/api/v1/results/{attemptId}", "/api/attempts/{attemptId}", "/api/v1/attempts/{attemptId}"})
    @Operation(summary = "Get single attempt result", description = "Retrieves comprehensive attempt audit with score breakdown and question review")
    public ResponseEntity<AttemptResultDto> getAttemptResult(
            @PathVariable Long attemptId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        AttemptResultDto result = attemptService.getAttemptResult(attemptId, userEmail);
        return ResponseEntity.ok(result);
    }

    @GetMapping({"/api/students/{studentId}/attempts", "/api/v1/students/{studentId}/attempts"})
    @Operation(summary = "Get student attempt history", description = "Returns all examination attempts completed by a specific student")
    public ResponseEntity<List<AttemptResultDto>> getStudentAttempts(
            @PathVariable Long studentId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<AttemptResultDto> attempts = attemptService.getStudentAttempts(studentId, userEmail);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping({"/api/students/{studentId}/performance", "/api/v1/students/{studentId}/performance"})
    @Operation(summary = "Get student performance diagnostics", description = "Returns historical trends, subject mastery, and diagnostic insights")
    public ResponseEntity<StudentPerformanceDto> getStudentPerformance(
            @PathVariable Long studentId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        StudentPerformanceDto performance = attemptService.getStudentPerformance(studentId, userEmail);
        return ResponseEntity.ok(performance);
    }

    @GetMapping({"/api/admin/results", "/api/v1/admin/results"})
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin result audit", description = "Audit and filter all candidate evaluation records across exams and statuses")
    public ResponseEntity<List<AttemptResultDto>> getAdminResults(
            @RequestParam(required = false) Long examId,
            @RequestParam(required = false, defaultValue = "all") String status) {
        List<AttemptResultDto> results = attemptService.getAllAttempts(examId, status);
        return ResponseEntity.ok(results);
    }
}
