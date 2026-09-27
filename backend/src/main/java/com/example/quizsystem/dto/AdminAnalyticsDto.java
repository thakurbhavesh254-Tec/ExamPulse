package com.example.quizsystem.dto;

import java.util.List;

public class AdminAnalyticsDto {

    private Overview overview;
    private List<ParticipationDay> participationTrend;
    private List<DepartmentPerf> departmentPerformance;
    private List<HardQuestion> hardestQuestions;
    private List<RecentActivity> recentActivity;

    public static class Overview {
        private Long totalStudents;
        private Long totalExams;
        private Long totalQuestions;
        private Long totalAttempts;
        private Double avgPassRate;
        private Double overallAvgScore;

        public Overview() {}

        public Overview(Long totalStudents, Long totalExams, Long totalQuestions, Long totalAttempts, Double avgPassRate, Double overallAvgScore) {
            this.totalStudents = totalStudents;
            this.totalExams = totalExams;
            this.totalQuestions = totalQuestions;
            this.totalAttempts = totalAttempts;
            this.avgPassRate = avgPassRate;
            this.overallAvgScore = overallAvgScore;
        }

        public Long getTotalStudents() { return totalStudents; }
        public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }
        public Long getTotalExams() { return totalExams; }
        public void setTotalExams(Long totalExams) { this.totalExams = totalExams; }
        public Long getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(Long totalQuestions) { this.totalQuestions = totalQuestions; }
        public Long getTotalAttempts() { return totalAttempts; }
        public void setTotalAttempts(Long totalAttempts) { this.totalAttempts = totalAttempts; }
        public Double getAvgPassRate() { return avgPassRate; }
        public void setAvgPassRate(Double avgPassRate) { this.avgPassRate = avgPassRate; }
        public Double getOverallAvgScore() { return overallAvgScore; }
        public void setOverallAvgScore(Double overallAvgScore) { this.overallAvgScore = overallAvgScore; }
    }

    public static class ParticipationDay {
        private String day;
        private Integer attempts;
        private Integer activeStudents;

        public ParticipationDay() {}
        public ParticipationDay(String day, Integer attempts, Integer activeStudents) {
            this.day = day;
            this.attempts = attempts;
            this.activeStudents = activeStudents;
        }
        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }
        public Integer getAttempts() { return attempts; }
        public void setAttempts(Integer attempts) { this.attempts = attempts; }
        public Integer getActiveStudents() { return activeStudents; }
        public void setActiveStudents(Integer activeStudents) { this.activeStudents = activeStudents; }
    }

    public static class DepartmentPerf {
        private String department;
        private Double avgScore;
        private Integer students;
        private Integer passRate;

        public DepartmentPerf() {}
        public DepartmentPerf(String department, Double avgScore, Integer students, Integer passRate) {
            this.department = department;
            this.avgScore = avgScore;
            this.students = students;
            this.passRate = passRate;
        }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public Double getAvgScore() { return avgScore; }
        public void setAvgScore(Double avgScore) { this.avgScore = avgScore; }
        public Integer getStudents() { return students; }
        public void setStudents(Integer students) { this.students = students; }
        public Integer getPassRate() { return passRate; }
        public void setPassRate(Integer passRate) { this.passRate = passRate; }
    }

    public static class HardQuestion {
        private Long id;
        private String subject;
        private String text;
        private Double failRate;

        public HardQuestion() {}
        public HardQuestion(Long id, String subject, String text, Double failRate) {
            this.id = id;
            this.subject = subject;
            this.text = text;
            this.failRate = failRate;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public Double getFailRate() { return failRate; }
        public void setFailRate(Double failRate) { this.failRate = failRate; }
    }

    public static class RecentActivity {
        private String id;
        private String student;
        private String exam;
        private String time;
        private String score;

        public RecentActivity() {}
        public RecentActivity(String id, String student, String exam, String time, String score) {
            this.id = id;
            this.student = student;
            this.exam = exam;
            this.time = time;
            this.score = score;
        }
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getStudent() { return student; }
        public void setStudent(String student) { this.student = student; }
        public String getExam() { return exam; }
        public void setExam(String exam) { this.exam = exam; }
        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        public String getScore() { return score; }
        public void setScore(String score) { this.score = score; }
    }

    public AdminAnalyticsDto() {}

    public Overview getOverview() { return overview; }
    public void setOverview(Overview overview) { this.overview = overview; }
    public List<ParticipationDay> getParticipationTrend() { return participationTrend; }
    public void setParticipationTrend(List<ParticipationDay> participationTrend) { this.participationTrend = participationTrend; }
    public List<DepartmentPerf> getDepartmentPerformance() { return departmentPerformance; }
    public void setDepartmentPerformance(List<DepartmentPerf> departmentPerformance) { this.departmentPerformance = departmentPerformance; }
    public List<HardQuestion> getHardestQuestions() { return hardestQuestions; }
    public void setHardestQuestions(List<HardQuestion> hardestQuestions) { this.hardestQuestions = hardestQuestions; }
    public List<RecentActivity> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<RecentActivity> recentActivity) { this.recentActivity = recentActivity; }
}
