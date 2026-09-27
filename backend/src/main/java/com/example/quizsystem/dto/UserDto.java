package com.example.quizsystem.dto;

import com.example.quizsystem.entity.Role;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String studentId;
    private String department;
    private Role role;
    private Integer attemptsCount = 0;
    private Double avgScore = 0.0;
    private String status = "Active";

    public UserDto() {
    }

    public UserDto(Long id, String name, String email, String studentId, String department, Role role,
                   Integer attemptsCount, Double avgScore, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.studentId = studentId;
        this.department = department;
        this.role = role;
        this.attemptsCount = attemptsCount != null ? attemptsCount : 0;
        this.avgScore = avgScore != null ? avgScore : 0.0;
        this.status = status != null ? status : "Active";
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Integer getAttemptsCount() {
        return attemptsCount;
    }

    public void setAttemptsCount(Integer attemptsCount) {
        this.attemptsCount = attemptsCount;
    }

    public Double getAvgScore() {
        return avgScore;
    }

    public void setAvgScore(Double avgScore) {
        this.avgScore = avgScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
