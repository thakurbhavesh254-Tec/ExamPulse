package com.example.quizsystem.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/health", "/api/v1/health"})
@Tag(name = "Health Check", description = "System liveness and heartbeat probing API")
public class HealthController {

    @GetMapping
    @Operation(summary = "Health probe", description = "Returns service liveness status and timestamp")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "ExamPulse Backend");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("version", "1.0.0");
        return ResponseEntity.ok(health);
    }
}
