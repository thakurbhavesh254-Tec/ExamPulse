package com.example.quizsystem.service.impl;

import com.example.quizsystem.dto.ExamDto;
import com.example.quizsystem.entity.Exam;
import com.example.quizsystem.entity.Question;
import com.example.quizsystem.entity.Subject;
import com.example.quizsystem.exception.BadRequestException;
import com.example.quizsystem.exception.ResourceNotFoundException;
import com.example.quizsystem.repository.ExamRepository;
import com.example.quizsystem.repository.QuestionRepository;
import com.example.quizsystem.repository.SubjectRepository;
import com.example.quizsystem.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ExamDto> getAllExams(Boolean publishedOnly, Long subjectId) {
        List<Exam> exams;

        if (Boolean.TRUE.equals(publishedOnly)) {
            if (subjectId != null) {
                exams = examRepository.findBySubjectIdAndPublishedTrue(subjectId);
            } else {
                exams = examRepository.findByPublishedTrue();
            }
        } else {
            if (subjectId != null) {
                exams = examRepository.findBySubjectId(subjectId);
            } else {
                exams = examRepository.findAll();
            }
        }

        return exams.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ExamDto getExamById(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
        return mapToDto(exam);
    }

    @Override
    @Transactional
    public ExamDto createExam(ExamDto dto) {
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + dto.getSubjectId()));

        if (dto.getPassingMarks() > dto.getTotalMarks()) {
            throw new BadRequestException("Passing marks cannot exceed total marks.");
        }

        String code = dto.getCode();
        if (code == null || code.trim().isEmpty()) {
            code = "EX-" + subject.getCode() + "-" + (int) (1000 + Math.random() * 9000);
        }

        Exam exam = new Exam(
                code,
                dto.getTitle(),
                dto.getDescription(),
                subject,
                dto.getDurationMinutes(),
                dto.getTotalMarks(),
                dto.getPassingMarks(),
                dto.getDifficulty() != null ? dto.getDifficulty() : "Medium",
                dto.getInstructions(),
                dto.getPublished() != null ? dto.getPublished() : true,
                dto.getAttemptsAllowed() != null ? dto.getAttemptsAllowed() : 1
        );

        Exam saved = examRepository.save(exam);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public ExamDto updateExam(Long id, ExamDto dto) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));

        if (dto.getPassingMarks() != null && dto.getTotalMarks() != null && dto.getPassingMarks() > dto.getTotalMarks()) {
            throw new BadRequestException("Passing marks cannot exceed total marks.");
        }

        if (dto.getSubjectId() != null && !dto.getSubjectId().equals(exam.getSubject().getId())) {
            Subject subject = subjectRepository.findById(dto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + dto.getSubjectId()));
            exam.setSubject(subject);
        }

        if (dto.getTitle() != null) exam.setTitle(dto.getTitle());
        if (dto.getDescription() != null) exam.setDescription(dto.getDescription());
        if (dto.getDurationMinutes() != null) exam.setDurationMinutes(dto.getDurationMinutes());
        if (dto.getTotalMarks() != null) exam.setTotalMarks(dto.getTotalMarks());
        if (dto.getPassingMarks() != null) exam.setPassingMarks(dto.getPassingMarks());
        if (dto.getDifficulty() != null) exam.setDifficulty(dto.getDifficulty());
        if (dto.getInstructions() != null) exam.setInstructions(dto.getInstructions());
        if (dto.getPublished() != null) exam.setPublished(dto.getPublished());
        if (dto.getAttemptsAllowed() != null) exam.setAttemptsAllowed(dto.getAttemptsAllowed());

        Exam updated = examRepository.save(exam);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteExam(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
        examRepository.delete(exam);
    }

    @Override
    @Transactional
    public ExamDto togglePublish(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
        exam.setPublished(!Boolean.TRUE.equals(exam.getPublished()));
        Exam updated = examRepository.save(exam);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public ExamDto duplicateExam(Long id) {
        Exam original = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));

        Exam duplicate = new Exam(
                original.getCode() + "-COPY-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase(),
                original.getTitle() + " (Copy)",
                original.getDescription(),
                original.getSubject(),
                original.getDurationMinutes(),
                original.getTotalMarks(),
                original.getPassingMarks(),
                original.getDifficulty(),
                original.getInstructions(),
                false, // Default to unpublished draft
                original.getAttemptsAllowed()
        );

        Exam savedDuplicate = examRepository.save(duplicate);

        // Copy questions
        if (original.getQuestions() != null) {
            List<Question> duplicatedQuestions = new ArrayList<>();
            for (Question q : original.getQuestions()) {
                Question newQ = new Question(
                        savedDuplicate,
                        q.getQuestionText(),
                        q.getOptionA(),
                        q.getOptionB(),
                        q.getOptionC(),
                        q.getOptionD(),
                        q.getCorrectAnswer(),
                        q.getMarks(),
                        q.getDifficulty(),
                        q.getTopic(),
                        q.getExplanation()
                );
                duplicatedQuestions.add(newQ);
            }
            questionRepository.saveAll(duplicatedQuestions);
        }

        return mapToDto(savedDuplicate);
    }

    private ExamDto mapToDto(Exam exam) {
        ExamDto dto = new ExamDto();
        dto.setId(exam.getId());
        dto.setCode(exam.getCode());
        dto.setTitle(exam.getTitle());
        dto.setDescription(exam.getDescription());

        if (exam.getSubject() != null) {
            dto.setSubjectId(exam.getSubject().getId());
            dto.setSubjectName(exam.getSubject().getName());
            dto.setSubjectCode(exam.getSubject().getCode());
        }

        dto.setDurationMinutes(exam.getDurationMinutes());
        dto.setTotalQuestions(exam.getQuestions() != null ? exam.getQuestions().size() : 0);
        dto.setTotalMarks(exam.getTotalMarks());
        dto.setPassingMarks(exam.getPassingMarks());
        dto.setDifficulty(exam.getDifficulty());
        dto.setInstructions(exam.getInstructions());
        dto.setPublished(exam.getPublished());
        dto.setAttemptsAllowed(exam.getAttemptsAllowed());
        dto.setCreatedAt(exam.getCreatedAt());
        return dto;
    }
}
