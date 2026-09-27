package com.example.quizsystem.dto;

public class LeaderboardEntryDto {

    private Integer rank;
    private Long id;
    private String name;
    private String rollNo;
    private String department;
    private Integer examsCompleted;
    private Integer totalScore;
    private Double averageScore;
    private String badge;
    private Boolean isCurrentUser = false;

    public LeaderboardEntryDto() {
    }

    public LeaderboardEntryDto(Integer rank, Long id, String name, String rollNo, String department,
                               Integer examsCompleted, Integer totalScore, Double averageScore, String badge) {
        this.rank = rank;
        this.id = id;
        this.name = name;
        this.rollNo = rollNo;
        this.department = department;
        this.examsCompleted = examsCompleted;
        this.totalScore = totalScore;
        this.averageScore = averageScore;
        this.badge = badge;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNo() {
        return rollNo;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getExamsCompleted() {
        return examsCompleted;
    }

    public void setExamsCompleted(Integer examsCompleted) {
        this.examsCompleted = examsCompleted;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public Boolean getIsCurrentUser() {
        return isCurrentUser;
    }

    public void setIsCurrentUser(Boolean isCurrentUser) {
        this.isCurrentUser = isCurrentUser;
    }
}
