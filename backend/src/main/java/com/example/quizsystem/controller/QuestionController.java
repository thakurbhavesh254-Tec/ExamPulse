package com.example.quizsystem.controller;

import com.example.quizsystem.dto.QuestionAdminDto;
import com.example.quizsystem.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api", "/api/v1"})
@Tag(name = "Questions", description = "Question Bank & Item Repository Management API")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("/questions")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all questions in bank with optional exam filter (Admin only)")
    public ResponseEntity<List<QuestionAdminDto>> getAllQuestions(@RequestParam(required = false) Long examId) {
        return ResponseEntity.ok(questionService.getAllQuestions(examId));
    }

    @GetMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get question by ID (Admin only)")
    public ResponseEntity<QuestionAdminDto> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @GetMapping("/exams/{examId}/questions")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all questions for specific exam (Admin only, includes answer keys)")
    public ResponseEntity<List<QuestionAdminDto>> getQuestionsByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(questionService.getQuestionsByExam(examId));
    }

    @PostMapping("/questions")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add question to repository (Admin only)")
    public ResponseEntity<QuestionAdminDto> createQuestion(@Valid @RequestBody QuestionAdminDto dto) {
        QuestionAdminDto created = questionService.createQuestion(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update question (Admin only)")
    public ResponseEntity<QuestionAdminDto> updateQuestion(@PathVariable Long id, @Valid @RequestBody QuestionAdminDto dto) {
        QuestionAdminDto updated = questionService.updateQuestion(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete question (Admin only)")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
