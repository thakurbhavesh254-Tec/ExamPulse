package com.example.quizsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class SubjectDto {
    private Long id;

    @NotBlank(message = "Subject code is required")
    private String code;

    @NotBlank(message = "Subject name is required")
    private String name;

    @NotBlank(message = "Department is required")
    private String department;

    private String description;
    private String status = "Active";
    private Integer examCount = 0;
    private Integer questionCount = 0;

    public SubjectDto() {
    }

    public SubjectDto(Long id, String code, String name, String department, String description, String status, Integer examCount, Integer questionCount) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.department = department;
        this.description = description;
        this.status = status;
        this.examCount = examCount != null ? examCount : 0;
        this.questionCount = questionCount != null ? questionCount : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getExamCount() {
        return examCount;
    }

    public void setExamCount(Integer examCount) {
        this.examCount = examCount;
    }

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }
}
