package com.example.quizsystem.controller;

import com.example.quizsystem.dto.ExamDto;
import com.example.quizsystem.service.ExamService;
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
@RequestMapping({"/api/exams", "/api/v1/exams"})
@Tag(name = "Exams", description = "Examination Scheduling and Management API")
public class ExamController {

    @Autowired
    private ExamService examService;

    @GetMapping
    @Operation(summary = "List all examinations with optional published and subject filters")
    public ResponseEntity<List<ExamDto>> getAllExams(
            @RequestParam(required = false) Boolean publishedOnly,
            @RequestParam(required = false) Long subjectId) {
        return ResponseEntity.ok(examService.getAllExams(publishedOnly, subjectId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get examination by ID")
    public ResponseEntity<ExamDto> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(examService.getExamById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new examination (Admin only)")
    public ResponseEntity<ExamDto> createExam(@Valid @RequestBody ExamDto dto) {
        ExamDto created = examService.createExam(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update examination (Admin only)")
    public ResponseEntity<ExamDto> updateExam(@PathVariable Long id, @Valid @RequestBody ExamDto dto) {
        ExamDto updated = examService.updateExam(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete examination (Admin only)")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle exam published status (Admin only)")
    public ResponseEntity<ExamDto> togglePublish(@PathVariable Long id) {
        return ResponseEntity.ok(examService.togglePublish(id));
    }

    @PostMapping("/{id}/duplicate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Duplicate existing exam template with questions (Admin only)")
    public ResponseEntity<ExamDto> duplicateExam(@PathVariable Long id) {
        ExamDto duplicated = examService.duplicateExam(id);
        return new ResponseEntity<>(duplicated, HttpStatus.CREATED);
    }
}
