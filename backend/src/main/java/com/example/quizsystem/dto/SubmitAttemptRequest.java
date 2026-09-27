package com.example.quizsystem.dto;

import java.util.ArrayList;
import java.util.List;

public class SubmitAttemptRequest {

    private Long attemptId;
    private List<AnswerSubmissionDto> answers = new ArrayList<>();
    private Integer durationSeconds;

    public SubmitAttemptRequest() {
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public SubmitAttemptRequest(List<AnswerSubmissionDto> answers, Integer durationSeconds) {
        this.answers = answers;
        this.durationSeconds = durationSeconds;
    }

    public List<AnswerSubmissionDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerSubmissionDto> answers) {
        this.answers = answers;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }
}
