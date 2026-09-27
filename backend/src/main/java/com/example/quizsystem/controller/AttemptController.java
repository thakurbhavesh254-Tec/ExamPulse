package com.example.quizsystem.controller;

import com.example.quizsystem.dto.StartAttemptResponse;
import com.example.quizsystem.dto.SubmitAttemptRequest;
import com.example.quizsystem.dto.SubmitAttemptResponse;
import com.example.quizsystem.exception.BadRequestException;
import com.example.quizsystem.service.AttemptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/attempts", "/api/v1/attempts"})
@Tag(name = "Exam Attempts", description = "Endpoints for starting and submitting proctored candidate attempts")
@SecurityRequirement(name = "BearerAuth")
public class AttemptController {

    @Autowired
    private AttemptService attemptService;

    @PostMapping("/start/{examId}")
    @Operation(summary = "Start an exam attempt", description = "Creates a session attempt and returns randomized questions WITHOUT correct answers.")
    public ResponseEntity<StartAttemptResponse> startAttempt(
            @PathVariable Long examId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        StartAttemptResponse response = attemptService.startAttempt(examId, userEmail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/{attemptId}/submit")
    @Operation(summary = "Submit an exam attempt with path parameter", description = "Submits candidate answers, computes marks, percentage, and returns immediate result.")
    public ResponseEntity<SubmitAttemptResponse> submitAttemptWithId(
            @PathVariable Long attemptId,
            @Valid @RequestBody SubmitAttemptRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        SubmitAttemptResponse response = attemptService.submitAttempt(attemptId, request, userEmail);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit an exam attempt with body payload", description = "Submits candidate answers where attemptId is provided inside the JSON body.")
    public ResponseEntity<SubmitAttemptResponse> submitAttempt(
            @Valid @RequestBody SubmitAttemptRequest request,
            Authentication authentication) {
        if (request.getAttemptId() == null) {
            throw new BadRequestException("attemptId must be provided in either the URL path or the request body.");
        }
        String userEmail = authentication.getName();
        SubmitAttemptResponse response = attemptService.submitAttempt(request.getAttemptId(), request, userEmail);
        return ResponseEntity.ok(response);
    }
}
