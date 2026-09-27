package com.example.quizsystem.service.impl;

import com.example.quizsystem.dto.QuestionAdminDto;
import com.example.quizsystem.dto.QuestionStudentDto;
import com.example.quizsystem.entity.Exam;
import com.example.quizsystem.entity.Question;
import com.example.quizsystem.exception.ResourceNotFoundException;
import com.example.quizsystem.repository.ExamRepository;
import com.example.quizsystem.repository.QuestionRepository;
import com.example.quizsystem.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    @Override
    @Transactional(readOnly = true)
    public List<QuestionAdminDto> getAllQuestions(Long examId) {
        List<Question> questions = (examId != null)
                ? questionRepository.findByExamId(examId)
                : questionRepository.findAll();
        return questions.stream().map(this::mapToAdminDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionAdminDto getQuestionById(Long id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        return mapToAdminDto(q);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionAdminDto> getQuestionsByExam(Long examId) {
        return questionRepository.findByExamId(examId).stream()
                .map(this::mapToAdminDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionStudentDto> getQuestionsForStudentAttempt(Long examId) {
        List<Question> questions = new ArrayList<>(questionRepository.findByExamId(examId));
        // Randomize the order of questions for this attempt as required
        Collections.shuffle(questions);

        return questions.stream()
                .map(q -> new QuestionStudentDto(
                        q.getId(),
                        q.getExam().getId(),
                        q.getQuestionText(),
                        q.getOptionA(),
                        q.getOptionB(),
                        q.getOptionC(),
                        q.getOptionD(),
                        q.getMarks(),
                        q.getDifficulty(),
                        q.getTopic()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuestionAdminDto createQuestion(QuestionAdminDto dto) {
        Exam exam = examRepository.findById(dto.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + dto.getExamId()));

        Question question = new Question(
                exam,
                dto.getQuestionText(),
                dto.getOptionA(),
                dto.getOptionB(),
                dto.getOptionC(),
                dto.getOptionD(),
                dto.getCorrectAnswer().toUpperCase().trim(),
                dto.getMarks() != null ? dto.getMarks() : 2,
                dto.getDifficulty() != null ? dto.getDifficulty() : "Medium",
                dto.getTopic(),
                dto.getExplanation()
        );

        Question saved = questionRepository.save(question);
        return mapToAdminDto(saved);
    }

    @Override
    @Transactional
    public QuestionAdminDto updateQuestion(Long id, QuestionAdminDto dto) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        if (dto.getExamId() != null && !dto.getExamId().equals(q.getExam().getId())) {
            Exam exam = examRepository.findById(dto.getExamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + dto.getExamId()));
            q.setExam(exam);
        }

        if (dto.getQuestionText() != null) q.setQuestionText(dto.getQuestionText());
        if (dto.getOptionA() != null) q.setOptionA(dto.getOptionA());
        if (dto.getOptionB() != null) q.setOptionB(dto.getOptionB());
        if (dto.getOptionC() != null) q.setOptionC(dto.getOptionC());
        if (dto.getOptionD() != null) q.setOptionD(dto.getOptionD());
        if (dto.getCorrectAnswer() != null) q.setCorrectAnswer(dto.getCorrectAnswer().toUpperCase().trim());
        if (dto.getMarks() != null) q.setMarks(dto.getMarks());
        if (dto.getDifficulty() != null) q.setDifficulty(dto.getDifficulty());
        if (dto.getTopic() != null) q.setTopic(dto.getTopic());
        if (dto.getExplanation() != null) q.setExplanation(dto.getExplanation());

        Question updated = questionRepository.save(q);
        return mapToAdminDto(updated);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long id) {
        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));
        questionRepository.delete(q);
    }

    private QuestionAdminDto mapToAdminDto(Question q) {
        QuestionAdminDto dto = new QuestionAdminDto();
        dto.setId(q.getId());
        dto.setExamId(q.getExam().getId());
        dto.setQuestionText(q.getQuestionText());
        dto.setOptionA(q.getOptionA());
        dto.setOptionB(q.getOptionB());
        dto.setOptionC(q.getOptionC());
        dto.setOptionD(q.getOptionD());
        dto.setCorrectAnswer(q.getCorrectAnswer());
        dto.setMarks(q.getMarks());
        dto.setDifficulty(q.getDifficulty());
        dto.setTopic(q.getTopic());
        dto.setExplanation(q.getExplanation());
        return dto;
    }
}
