package com.example.quizsystem.dto;

import java.time.LocalDateTime;
import java.util.List;

public class StartAttemptResponse {

    private Long attemptId;
    private Long examId;
    private String examTitle;
    private String subjectCode;
    private Integer durationMinutes;
    private Integer totalMarks;
    private Integer passingMarks;
    private LocalDateTime startTime;
    private List<QuestionStudentDto> questions;

    public StartAttemptResponse() {
    }

    public StartAttemptResponse(Long attemptId, Long examId, String examTitle, String subjectCode,
                                Integer durationMinutes, Integer totalMarks, Integer passingMarks,
                                LocalDateTime startTime, List<QuestionStudentDto> questions) {
        this.attemptId = attemptId;
        this.examId = examId;
        this.examTitle = examTitle;
        this.subjectCode = subjectCode;
        this.durationMinutes = durationMinutes;
        this.totalMarks = totalMarks;
        this.passingMarks = passingMarks;
        this.startTime = startTime;
        this.questions = questions;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Integer getPassingMarks() {
        return passingMarks;
    }

    public void setPassingMarks(Integer passingMarks) {
        this.passingMarks = passingMarks;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public List<QuestionStudentDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionStudentDto> questions) {
        this.questions = questions;
    }
}
