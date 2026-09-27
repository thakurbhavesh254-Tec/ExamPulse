package com.example.quizsystem.service;

import com.example.quizsystem.dto.*;
import java.util.List;

public interface AttemptService {
    StartAttemptResponse startAttempt(Long examId, String userEmail);
    SubmitAttemptResponse submitAttempt(Long attemptId, SubmitAttemptRequest request, String userEmail);
    AttemptResultDto getAttemptResult(Long attemptId, String userEmail);
    List<AttemptResultDto> getStudentAttempts(Long studentId, String requestingUserEmail);
    StudentPerformanceDto getStudentPerformance(Long studentId, String requestingUserEmail);
    List<AttemptResultDto> getAllAttempts(Long examId, String status);
}
