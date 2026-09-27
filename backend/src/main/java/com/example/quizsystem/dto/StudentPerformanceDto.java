package com.example.quizsystem.dto;

import java.util.List;

public class StudentPerformanceDto {

    private List<ScoreTrendItem> scoreTrend;
    private List<SubjectBreakdownItem> subjectBreakdown;
    private List<PassFailItem> passFailDistribution;
    private List<String> insights;
    private Long totalAttemptsCount;
    private Double averageScore;

    public static class ScoreTrendItem {
        private String exam;
        private Double score;
        private Double avgScore;
        private String date;

        public ScoreTrendItem() {}
        public ScoreTrendItem(String exam, Double score, Double avgScore, String date) {
            this.exam = exam;
            this.score = score;
            this.avgScore = avgScore;
            this.date = date;
        }
        public String getExam() { return exam; }
        public void setExam(String exam) { this.exam = exam; }
        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }
        public Double getAvgScore() { return avgScore; }
        public void setAvgScore(Double avgScore) { this.avgScore = avgScore; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
    }

    public static class SubjectBreakdownItem {
        private String subject;
        private Double score;
        private Double fullMark = 100.0;

        public SubjectBreakdownItem() {}
        public SubjectBreakdownItem(String subject, Double score, Double fullMark) {
            this.subject = subject;
            this.score = score;
            this.fullMark = fullMark;
        }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }
        public Double getFullMark() { return fullMark; }
        public void setFullMark(Double fullMark) { this.fullMark = fullMark; }
    }

    public static class PassFailItem {
        private String name;
        private Integer value;
        private String color;

        public PassFailItem() {}
        public PassFailItem(String name, Integer value, String color) {
            this.name = name;
            this.value = value;
            this.color = color;
        }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Integer getValue() { return value; }
        public void setValue(Integer value) { this.value = value; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public StudentPerformanceDto() {}

    public List<ScoreTrendItem> getScoreTrend() { return scoreTrend; }
    public void setScoreTrend(List<ScoreTrendItem> scoreTrend) { this.scoreTrend = scoreTrend; }
    public List<SubjectBreakdownItem> getSubjectBreakdown() { return subjectBreakdown; }
    public void setSubjectBreakdown(List<SubjectBreakdownItem> subjectBreakdown) { this.subjectBreakdown = subjectBreakdown; }
    public List<PassFailItem> getPassFailDistribution() { return passFailDistribution; }
    public void setPassFailDistribution(List<PassFailItem> passFailDistribution) { this.passFailDistribution = passFailDistribution; }
    public List<String> getInsights() { return insights; }
    public void setInsights(List<String> insights) { this.insights = insights; }
    public Long getTotalAttemptsCount() { return totalAttemptsCount; }
    public void setTotalAttemptsCount(Long totalAttemptsCount) { this.totalAttemptsCount = totalAttemptsCount; }
    public Double getAverageScore() { return averageScore; }
    public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }
}
