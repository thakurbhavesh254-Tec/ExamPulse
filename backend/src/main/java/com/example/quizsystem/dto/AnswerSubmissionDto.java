package com.example.quizsystem.dto;

import jakarta.validation.constraints.NotNull;

public class AnswerSubmissionDto {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String selectedAnswer; // "A", "B", "C", "D" or null if skipped

    public AnswerSubmissionDto() {
    }

    public AnswerSubmissionDto(Long questionId, String selectedAnswer) {
        this.questionId = questionId;
        this.selectedAnswer = selectedAnswer;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
}
