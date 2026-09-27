package com.example.quizsystem;

import com.example.quizsystem.dto.*;
import com.example.quizsystem.entity.*;
import com.example.quizsystem.repository.*;
import com.example.quizsystem.service.AttemptService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:quiztestdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driverClassName=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@Transactional
public class AttemptEvaluationTest {

    @Autowired
    private AttemptService attemptService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testStudent;
    private Exam testExam;
    private List<Question> testQuestions;

    @BeforeEach
    void setUp() {
        testStudent = userRepository.save(new User(
                "Test Student",
                "test.student@apexuniv.edu.in",
                passwordEncoder.encode("TestPass@123"),
                "TEST-001",
                "Computer Science",
                Role.ROLE_STUDENT
        ));

        Subject subject = subjectRepository.save(new Subject(
                "TEST101",
                "Test Foundations",
                "Computer Science",
                "Test subject description"
        ));

        testExam = examRepository.save(new Exam(
                "EXAM-TEST-01",
                "Unit Test Evaluation",
                "Test description",
                subject,
                30,
                50,
                25,
                "Easy",
                "Test instructions",
                true,
                2
        ));

        testQuestions = new ArrayList<>();
        testQuestions.add(questionRepository.save(new Question(
                testExam, "What is 2+2?", "1", "4", "3", "5", "B", 25, "Easy", "Math", "2+2=4"
        )));
        testQuestions.add(questionRepository.save(new Question(
                testExam, "What is 5*5?", "10", "20", "25", "30", "C", 25, "Easy", "Math", "5*5=25"
        )));
    }

    @Test
    void testStartAttempt_HidesCorrectAnswers() {
        StartAttemptResponse response = attemptService.startAttempt(testExam.getId(), testStudent.getEmail());

        assertNotNull(response);
        assertNotNull(response.getAttemptId());
        assertEquals(2, response.getQuestions().size());

        // CRITICAL SECURITY ASSERTION: Student questions must NOT have correctAnswer or explanation properties exposed!
        for (QuestionStudentDto q : response.getQuestions()) {
            assertNotNull(q.getQuestionText());
            assertNotNull(q.getOptionA());
            assertNotNull(q.getOptionB());
            assertNotNull(q.getOptionC());
            assertNotNull(q.getOptionD());
        }
    }

    @Test
    void testSubmitAttempt_CorrectScoringAndPassing() {
        StartAttemptResponse startResp = attemptService.startAttempt(testExam.getId(), testStudent.getEmail());
        Long attemptId = startResp.getAttemptId();

        // Submit both correct answers (B and C)
        SubmitAttemptRequest request = new SubmitAttemptRequest();
        List<AnswerSubmissionDto> answers = new ArrayList<>();
        answers.add(new AnswerSubmissionDto(testQuestions.get(0).getId(), "B"));
        answers.add(new AnswerSubmissionDto(testQuestions.get(1).getId(), "C"));
        request.setAnswers(answers);

        SubmitAttemptResponse response = attemptService.submitAttempt(attemptId, request, testStudent.getEmail());

        assertNotNull(response);
        assertEquals(50, response.getScore());
        assertEquals(50, response.getTotalMarks());
        assertEquals(100.0, response.getPercentage());
        assertEquals("PASS", response.getStatus());
        assertEquals(2, response.getCorrectAnswers());
        assertEquals(0, response.getIncorrectAnswers());
    }

    @Test
    void testSubmitAttempt_FailingScore() {
        StartAttemptResponse startResp = attemptService.startAttempt(testExam.getId(), testStudent.getEmail());
        Long attemptId = startResp.getAttemptId();

        // Submit both incorrect answers (A and A)
        SubmitAttemptRequest request = new SubmitAttemptRequest();
        List<AnswerSubmissionDto> answers = new ArrayList<>();
        answers.add(new AnswerSubmissionDto(testQuestions.get(0).getId(), "A"));
        answers.add(new AnswerSubmissionDto(testQuestions.get(1).getId(), "A"));
        request.setAnswers(answers);

        SubmitAttemptResponse response = attemptService.submitAttempt(attemptId, request, testStudent.getEmail());

        assertNotNull(response);
        assertEquals(0, response.getScore());
        assertEquals(0.0, response.getPercentage());
        assertEquals("FAIL", response.getStatus());
        assertEquals(0, response.getCorrectAnswers());
        assertEquals(2, response.getIncorrectAnswers());
    }
}
