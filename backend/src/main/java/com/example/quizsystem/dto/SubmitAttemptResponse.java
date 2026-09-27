package com.example.quizsystem.dto;

import com.example.quizsystem.entity.AttemptStatus;

public class SubmitAttemptResponse {

    private Long attemptId;
    private Integer score;
    private Integer totalMarks;
    private Double percentage;
    private Integer correctAnswers;
    private Integer incorrectAnswers;
    private Integer unanswered;
    private AttemptStatus status;

    public SubmitAttemptResponse() {
    }

    public SubmitAttemptResponse(Long attemptId, Integer score, Integer totalMarks, Double percentage,
                                 Integer correctAnswers, Integer incorrectAnswers, Integer unanswered,
                                 AttemptStatus status) {
        this.attemptId = attemptId;
        this.score = score;
        this.totalMarks = totalMarks;
        this.percentage = percentage;
        this.correctAnswers = correctAnswers;
        this.incorrectAnswers = incorrectAnswers;
        this.unanswered = unanswered;
        this.status = status;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getIncorrectAnswers() {
        return incorrectAnswers;
    }

    public void setIncorrectAnswers(Integer incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }

    public Integer getUnanswered() {
        return unanswered;
    }

    public void setUnanswered(Integer unanswered) {
        this.unanswered = unanswered;
    }

    public AttemptStatus getStatus() {
        return status;
    }

    public void setStatus(AttemptStatus status) {
        this.status = status;
    }
}
