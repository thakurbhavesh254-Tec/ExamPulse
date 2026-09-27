package com.example.quizsystem.service.impl;

import com.example.quizsystem.dto.SubjectDto;
import com.example.quizsystem.entity.Subject;
import com.example.quizsystem.exception.DuplicateResourceException;
import com.example.quizsystem.exception.ResourceNotFoundException;
import com.example.quizsystem.repository.ExamRepository;
import com.example.quizsystem.repository.SubjectRepository;
import com.example.quizsystem.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ExamRepository examRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectDto getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return mapToDto(subject);
    }

    @Override
    @Transactional
    public SubjectDto createSubject(SubjectDto dto) {
        if (subjectRepository.existsByCode(dto.getCode())) {
            throw new DuplicateResourceException("Subject code already exists: " + dto.getCode());
        }

        Subject subject = new Subject(
                dto.getCode(),
                dto.getName(),
                dto.getDepartment(),
                dto.getDescription()
        );
        if (dto.getStatus() != null) {
            subject.setStatus(dto.getStatus());
        }

        Subject saved = subjectRepository.save(subject);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public SubjectDto updateSubject(Long id, SubjectDto dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

        if (!subject.getCode().equalsIgnoreCase(dto.getCode()) && subjectRepository.existsByCode(dto.getCode())) {
            throw new DuplicateResourceException("Subject code already in use: " + dto.getCode());
        }

        subject.setCode(dto.getCode());
        subject.setName(dto.getName());
        subject.setDepartment(dto.getDepartment());
        subject.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            subject.setStatus(dto.getStatus());
        }

        Subject updated = subjectRepository.save(subject);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        subjectRepository.delete(subject);
    }

    private SubjectDto mapToDto(Subject subject) {
        int examCount = subject.getExams() != null ? subject.getExams().size() : 0;
        int questionCount = 0;
        if (subject.getExams() != null) {
            questionCount = subject.getExams().stream()
                    .mapToInt(e -> e.getQuestions() != null ? e.getQuestions().size() : 0)
                    .sum();
        }

        return new SubjectDto(
                subject.getId(),
                subject.getCode(),
                subject.getName(),
                subject.getDepartment(),
                subject.getDescription(),
                subject.getStatus(),
                examCount,
                questionCount
        );
    }
}
