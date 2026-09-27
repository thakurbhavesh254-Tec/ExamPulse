package com.example.quizsystem.service.impl;

import com.example.quizsystem.dto.*;
import com.example.quizsystem.entity.*;
import com.example.quizsystem.exception.BadRequestException;
import com.example.quizsystem.exception.ResourceNotFoundException;
import com.example.quizsystem.exception.UnauthorizedException;
import com.example.quizsystem.repository.*;
import com.example.quizsystem.service.AttemptService;
import com.example.quizsystem.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AttemptServiceImpl implements AttemptService {

    @Autowired
    private AttemptRepository attemptRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionService questionService;

    @Override
    @Transactional
    public StartAttemptResponse startAttempt(Long examId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        if (!Boolean.TRUE.equals(exam.getPublished()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("This examination is not currently published for candidate attempts.");
        }

        // Check allowed attempts limit
        List<Attempt> previousAttempts = attemptRepository.findByUserIdAndExamId(user.getId(), examId);
        long completedAttempts = previousAttempts.stream()
                .filter(a -> a.getStatus() != AttemptStatus.IN_PROGRESS)
                .count();

        if (exam.getAttemptsAllowed() != null && completedAttempts >= exam.getAttemptsAllowed() && user.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("You have already reached the maximum allowed attempts (" + exam.getAttemptsAllowed() + ") for this examination.");
        }

        // Create new attempt
        Attempt attempt = new Attempt(user, exam);
        attempt.setStartTime(LocalDateTime.now());
        attempt.setStatus(AttemptStatus.IN_PROGRESS);
        attempt.setTotalMarks(exam.getTotalMarks());

        Attempt savedAttempt = attemptRepository.save(attempt);

        // Fetch randomized student questions (NO correct answers exposed!)
        List<QuestionStudentDto> questions = questionService.getQuestionsForStudentAttempt(examId);

        return new StartAttemptResponse(
                savedAttempt.getId(),
                exam.getId(),
                exam.getTitle(),
                exam.getSubject().getCode(),
                exam.getDurationMinutes(),
                exam.getTotalMarks(),
                exam.getPassingMarks(),
                savedAttempt.getStartTime(),
                questions
        );
    }

    @Override
    @Transactional
    public SubmitAttemptResponse submitAttempt(Long attemptId, SubmitAttemptRequest request, String userEmail) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        // 1. Verify student ownership
        if (!attempt.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to submit this attempt.");
        }

        // 2. Prevent duplicate submission
        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new BadRequestException("This attempt has already been finalized and submitted.");
        }

        Exam exam = attempt.getExam();
        List<Question> questions = questionRepository.findByExamId(exam.getId());

        // Map submitted answers by questionId
        Map<Long, String> submittedAnswersMap = new HashMap<>();
        if (request.getAnswers() != null) {
            for (AnswerSubmissionDto ans : request.getAnswers()) {
                if (ans.getQuestionId() != null) {
                    submittedAnswersMap.put(ans.getQuestionId(), ans.getSelectedAnswer());
                }
            }
        }

        int score = 0;
        int totalMarks = 0;
        int correctCount = 0;
        int incorrectCount = 0;
        int unansweredCount = 0;

        List<Answer> answerEntities = new ArrayList<>();

        for (Question q : questions) {
            totalMarks += q.getMarks();
            String selected = submittedAnswersMap.get(q.getId());

            if (selected == null || selected.trim().isEmpty()) {
                unansweredCount++;
                Answer ans = new Answer(attempt, q, null, false, 0);
                answerEntities.add(ans);
            } else {
                boolean isCorrect = selected.trim().equalsIgnoreCase(q.getCorrectAnswer().trim());
                int marksAwarded = isCorrect ? q.getMarks() : 0;

                if (isCorrect) {
                    correctCount++;
                    score += marksAwarded;
                } else {
                    incorrectCount++;
                }

                Answer ans = new Answer(attempt, q, selected.trim().toUpperCase(), isCorrect, marksAwarded);
                answerEntities.add(ans);
            }
        }

        double percentage = totalMarks > 0 ? ((double) score / totalMarks) * 100.0 : 0.0;
        percentage = Math.round(percentage * 10.0) / 10.0;

        AttemptStatus finalStatus = score >= exam.getPassingMarks() ? AttemptStatus.PASS : AttemptStatus.FAIL;

        attempt.setSubmitTime(LocalDateTime.now());
        attempt.setDurationSeconds(request.getDurationSeconds() != null ? request.getDurationSeconds() : 0);
        attempt.setScore(score);
        attempt.setTotalMarks(totalMarks);
        attempt.setPercentage(percentage);
        attempt.setCorrectAnswers(correctCount);
        attempt.setIncorrectAnswers(incorrectCount);
        attempt.setUnanswered(unansweredCount);
        attempt.setStatus(finalStatus);

        attemptRepository.save(attempt);
        answerRepository.saveAll(answerEntities);

        return new SubmitAttemptResponse(
                attempt.getId(),
                score,
                totalMarks,
                percentage,
                correctCount,
                incorrectCount,
                unansweredCount,
                finalStatus
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AttemptResultDto getAttemptResult(Long attemptId, String userEmail) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (!attempt.getUser().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to view results for this attempt.");
        }

        return mapToResultDto(attempt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttemptResultDto> getStudentAttempts(Long studentId, String requestingUserEmail) {
        User requestingUser = userRepository.findByEmail(requestingUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + requestingUserEmail));

        if (!requestingUser.getId().equals(studentId) && requestingUser.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to view these attempt records.");
        }

        return attemptRepository.findByUserIdOrderByStartTimeDesc(studentId).stream()
                .map(this::mapToResultDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttemptResultDto> getAllAttempts(Long examId, String status) {
        List<Attempt> attempts = (examId != null)
                ? attemptRepository.findByExamIdOrderByStartTimeDesc(examId)
                : attemptRepository.findAll();

        if (status != null && !status.equalsIgnoreCase("all")) {
            attempts = attempts.stream()
                    .filter(a -> a.getStatus().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        return attempts.stream().map(this::mapToResultDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentPerformanceDto getStudentPerformance(Long studentId, String requestingUserEmail) {
        User requestingUser = userRepository.findByEmail(requestingUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + requestingUserEmail));

        if (!requestingUser.getId().equals(studentId) && requestingUser.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to view this candidate's analytics.");
        }

        List<Attempt> attempts = attemptRepository.findByUserIdOrderByStartTimeDesc(studentId);
        List<Attempt> completedAttempts = attempts.stream()
                .filter(a -> a.getStatus() != AttemptStatus.IN_PROGRESS)
                .collect(Collectors.toList());

        StudentPerformanceDto dto = new StudentPerformanceDto();
        dto.setTotalAttemptsCount((long) completedAttempts.size());

        double avgScore = completedAttempts.isEmpty() ? 0.0 :
                completedAttempts.stream().mapToDouble(Attempt::getPercentage).average().orElse(0.0);
        dto.setAverageScore(Math.round(avgScore * 10.0) / 10.0);

        // Score Trend
        List<StudentPerformanceDto.ScoreTrendItem> trend = new ArrayList<>();
        // Reverse to chronological order
        List<Attempt> chronological = new ArrayList<>(completedAttempts);
        Collections.reverse(chronological);
        for (Attempt a : chronological) {
            String dateStr = a.getSubmitTime() != null ? a.getSubmitTime().getMonth().name().substring(0, 3) + " " + a.getSubmitTime().getDayOfMonth() : "Recent";
            trend.add(new StudentPerformanceDto.ScoreTrendItem(
                    a.getExam().getSubject().getCode() + " " + a.getExam().getTitle(),
                    a.getPercentage(),
                    74.0, // Class benchmark
                    dateStr
            ));
        }
        dto.setScoreTrend(trend);

        // Subject breakdown
        Map<String, List<Double>> subjectScores = new HashMap<>();
        for (Attempt a : completedAttempts) {
            String subName = a.getExam().getSubject().getName();
            subjectScores.computeIfAbsent(subName, k -> new ArrayList<>()).add(a.getPercentage());
        }

        List<StudentPerformanceDto.SubjectBreakdownItem> subjectBreakdown = new ArrayList<>();
        subjectScores.forEach((subject, scores) -> {
            double mean = scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            subjectBreakdown.add(new StudentPerformanceDto.SubjectBreakdownItem(subject, Math.round(mean * 10.0) / 10.0, 100.0));
        });
        dto.setSubjectBreakdown(subjectBreakdown);

        // Pass/Fail distribution
        long passedCount = completedAttempts.stream().filter(a -> a.getStatus() == AttemptStatus.PASS).count();
        long failedCount = completedAttempts.stream().filter(a -> a.getStatus() == AttemptStatus.FAIL).count();

        List<StudentPerformanceDto.PassFailItem> passFail = new ArrayList<>();
        passFail.add(new StudentPerformanceDto.PassFailItem("Passed Exams", (int) passedCount, "#10B981"));
        passFail.add(new StudentPerformanceDto.PassFailItem("Remedial Required", (int) failedCount, "#EF4444"));
        dto.setPassFailDistribution(passFail);

        // Insights
        List<String> insights = new ArrayList<>();
        insights.add("Your cumulative score is trending positively across core departmental assessments.");
        insights.add("Completed " + completedAttempts.size() + " evaluations on schedule under proctor verification.");
        insights.add("Maintained continuous participation streak throughout active semester evaluations.");
        dto.setInsights(insights);

        return dto;
    }

    private AttemptResultDto mapToResultDto(Attempt attempt) {
        AttemptResultDto dto = new AttemptResultDto();
        dto.setId(attempt.getId());
        dto.setExamId(attempt.getExam().getId());
        dto.setExamTitle(attempt.getExam().getTitle());
        dto.setSubjectCode(attempt.getExam().getSubject().getCode());
        dto.setSubjectName(attempt.getExam().getSubject().getName());

        dto.setStudentId(attempt.getUser().getId());
        dto.setStudentName(attempt.getUser().getName());
        dto.setStudentRoll(attempt.getUser().getStudentId());

        dto.setAttemptDate(attempt.getSubmitTime() != null ? attempt.getSubmitTime() : attempt.getStartTime());
        dto.setScore(attempt.getScore());
        dto.setTotalMarks(attempt.getTotalMarks());
        dto.setPercentage(attempt.getPercentage());
        dto.setStatus(attempt.getStatus());
        dto.setPassingMarks(attempt.getExam().getPassingMarks());
        dto.setDurationSeconds(attempt.getDurationSeconds());
        dto.setCorrectCount(attempt.getCorrectAnswers());
        dto.setIncorrectCount(attempt.getIncorrectAnswers());
        dto.setUnansweredCount(attempt.getUnanswered());

        // Answers
        List<AttemptResultDto.AnswerDetailDto> answerDtos = new ArrayList<>();
        if (attempt.getAnswers() != null) {
            for (Answer ans : attempt.getAnswers()) {
                AttemptResultDto.AnswerDetailDto detail = new AttemptResultDto.AnswerDetailDto();
                Question q = ans.getQuestion();
                detail.setQuestionId(q.getId());
                detail.setQuestionText(q.getQuestionText());
                detail.setOptionA(q.getOptionA());
                detail.setOptionB(q.getOptionB());
                detail.setOptionC(q.getOptionC());
                detail.setOptionD(q.getOptionD());
                detail.setSelectedAnswer(ans.getSelectedAnswer());
                detail.setCorrectAnswer(q.getCorrectAnswer());
                detail.setIsCorrect(ans.getIsCorrect());
                detail.setMarksAwarded(ans.getMarksAwarded());
                detail.setExplanation(q.getExplanation());
                detail.setTopic(q.getTopic());
                answerDtos.add(detail);
            }
        }
        dto.setAnswers(answerDtos);

        return dto;
    }
}
