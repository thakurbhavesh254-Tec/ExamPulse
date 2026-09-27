package com.example.quizsystem.service;

import com.example.quizsystem.dto.ExamDto;
import java.util.List;

public interface ExamService {
    List<ExamDto> getAllExams(Boolean publishedOnly, Long subjectId);
    ExamDto getExamById(Long id);
    ExamDto createExam(ExamDto dto);
    ExamDto updateExam(Long id, ExamDto dto);
    void deleteExam(Long id);
    ExamDto togglePublish(Long id);
    ExamDto duplicateExam(Long id);
}
