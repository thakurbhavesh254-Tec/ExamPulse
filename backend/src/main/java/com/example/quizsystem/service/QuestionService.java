package com.example.quizsystem.service;

import com.example.quizsystem.dto.QuestionAdminDto;
import com.example.quizsystem.dto.QuestionStudentDto;
import java.util.List;

public interface QuestionService {
    List<QuestionAdminDto> getAllQuestions(Long examId);
    QuestionAdminDto getQuestionById(Long id);
    List<QuestionAdminDto> getQuestionsByExam(Long examId);
    List<QuestionStudentDto> getQuestionsForStudentAttempt(Long examId);
    QuestionAdminDto createQuestion(QuestionAdminDto dto);
    QuestionAdminDto updateQuestion(Long id, QuestionAdminDto dto);
    void deleteQuestion(Long id);
}
