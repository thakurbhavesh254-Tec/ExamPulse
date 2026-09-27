// Result & Attempt Service supporting DEMO and LIVE Spring Boot REST APIs

import { getItem, setItem, simulateDelay, STORAGE_KEYS, isLiveMode, liveRequest } from './apiClient';
import { questionService } from './questionService';
import { examService } from './examService';

export const resultService = {
  // GET /api/admin/results or /api/attempts
  async getAllAttempts(filters = {}) {
    if (isLiveMode()) {
      let endpoint = '/admin/results';
      const params = new URLSearchParams();
      if (filters.examId && filters.examId !== 'all') params.append('examId', filters.examId);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      const queryString = params.toString();
      if (queryString) endpoint += `?${queryString}`;

      let attempts = await liveRequest(endpoint);
      if (!Array.isArray(attempts)) attempts = [];

      return attempts.map(a => ({
        id: a.id,
        examId: a.examId,
        examTitle: a.examTitle,
        subjectCode: a.subjectCode,
        subjectName: a.subjectName,
        studentId: a.studentId,
        studentName: a.studentName,
        studentRoll: a.studentRoll,
        attemptDate: a.attemptDate,
        score: a.score,
        totalMarks: a.totalMarks,
        percentage: a.percentage,
        status: a.status === 'PASS' ? 'PASSED' : (a.status === 'FAIL' ? 'FAILED' : a.status),
        durationSeconds: a.durationSeconds,
        correctCount: a.correctCount,
        incorrectCount: a.incorrectCount,
        unansweredCount: a.unansweredCount,
        passingMarks: a.passingMarks,
        responses: (a.answers || []).reduce((acc, ans) => {
          acc[ans.questionId] = {
            selected: ans.selectedAnswer,
            correct: ans.correctAnswer,
            isCorrect: ans.isCorrect,
            marksAwarded: ans.marksAwarded,
            topic: ans.topic,
            explanation: ans.explanation
          };
          return acc;
        }, {})
      }));
    }

    await simulateDelay(150);
    let attempts = getItem(STORAGE_KEYS.ATTEMPTS) || [];

    if (filters.examId && filters.examId !== 'all') {
      attempts = attempts.filter(a => String(a.examId) === String(filters.examId));
    }
    if (filters.studentId && filters.studentId !== 'all') {
      attempts = attempts.filter(a => String(a.studentId) === String(filters.studentId));
    }
    if (filters.status && filters.status !== 'all') {
      attempts = attempts.filter(a => a.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      attempts = attempts.filter(a => 
        (a.examTitle && a.examTitle.toLowerCase().includes(q)) ||
        (a.studentName && a.studentName.toLowerCase().includes(q)) ||
        (a.studentRoll && a.studentRoll.toLowerCase().includes(q)) ||
        (a.subjectName && a.subjectName.toLowerCase().includes(q))
      );
    }

    return attempts;
  },

  // GET /api/students/:studentId/attempts
  async getStudentAttempts(studentId) {
    if (isLiveMode()) {
      let attempts = await liveRequest(`/students/${studentId}/attempts`);
      if (!Array.isArray(attempts)) attempts = [];
      return attempts.map(a => ({
        id: a.id,
        examId: a.examId,
        examTitle: a.examTitle,
        subjectCode: a.subjectCode,
        subjectName: a.subjectName,
        studentId: a.studentId,
        studentName: a.studentName,
        studentRoll: a.studentRoll,
        attemptDate: a.attemptDate,
        score: a.score,
        totalMarks: a.totalMarks,
        percentage: a.percentage,
        status: a.status === 'PASS' ? 'PASSED' : (a.status === 'FAIL' ? 'FAILED' : a.status),
        durationSeconds: a.durationSeconds,
        correctCount: a.correctCount,
        incorrectCount: a.incorrectCount,
        unansweredCount: a.unansweredCount,
        passingMarks: a.passingMarks
      }));
    }

    await simulateDelay(120);
    const attempts = getItem(STORAGE_KEYS.ATTEMPTS) || [];
    return attempts.filter(a => String(a.studentId) === String(studentId));
  },

  // GET /api/results/:id
  async getAttemptById(id) {
    if (isLiveMode()) {
      const a = await liveRequest(`/results/${id}`);
      return {
        id: a.id,
        examId: a.examId,
        examTitle: a.examTitle,
        subjectCode: a.subjectCode,
        subjectName: a.subjectName,
        studentId: a.studentId,
        studentName: a.studentName,
        studentRoll: a.studentRoll,
        attemptDate: a.attemptDate,
        score: a.score,
        totalMarks: a.totalMarks,
        percentage: a.percentage,
        status: a.status === 'PASS' ? 'PASSED' : (a.status === 'FAIL' ? 'FAILED' : a.status),
        durationSeconds: a.durationSeconds,
        correctCount: a.correctCount,
        incorrectCount: a.incorrectCount,
        unansweredCount: a.unansweredCount,
        passingMarks: a.passingMarks,
        responses: (a.answers || []).reduce((acc, ans) => {
          acc[ans.questionId] = {
            selected: ans.selectedAnswer,
            correct: ans.correctAnswer,
            isCorrect: ans.isCorrect,
            marksAwarded: ans.marksAwarded,
            topic: ans.topic,
            explanation: ans.explanation
          };
          return acc;
        }, {}),
        questions: (a.answers || []).map(ans => ({
          id: ans.questionId,
          text: ans.questionText,
          questionText: ans.questionText,
          options: [
            { id: 'A', text: ans.optionA },
            { id: 'B', text: ans.optionB },
            { id: 'C', text: ans.optionC },
            { id: 'D', text: ans.optionD }
          ],
          correctAnswer: ans.correctAnswer,
          topic: ans.topic,
          explanation: ans.explanation,
          marks: ans.marksAwarded || 2
        }))
      };
    }

    await simulateDelay(100);
    const attempts = getItem(STORAGE_KEYS.ATTEMPTS) || [];
    return attempts.find(a => String(a.id) === String(id)) || null;
  },

  // Start attempt in LIVE mode
  async startLiveAttempt(examId) {
    if (isLiveMode()) {
      return await liveRequest(`/attempts/start/${examId}`, { method: 'POST' });
    }
    return null;
  },

  // POST /api/attempts/submit
  async submitExam({ examId, student, answers, durationSeconds, liveAttemptId }) {
    if (isLiveMode()) {
      // 1. If we don't have an active attempt session ID yet, start one
      let attemptId = liveAttemptId;
      if (!attemptId) {
        const startSession = await liveRequest(`/attempts/start/${examId}`, { method: 'POST' });
        attemptId = startSession.attemptId;
      }

      // 2. Format answers array: [{ questionId, selectedAnswer }]
      const answerList = Object.entries(answers || {}).map(([qId, sel]) => ({
        questionId: Number(qId) || qId,
        selectedAnswer: sel
      }));

      // 3. Submit attempt
      const result = await liveRequest(`/attempts/${attemptId}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          durationSeconds: durationSeconds || 600,
          answers: answerList
        })
      });

      // 4. Fetch full breakdown
      try {
        const fullAudit = await this.getAttemptById(attemptId);
        return fullAudit;
      } catch (e) {
        return {
          id: result.attemptId,
          examId,
          examTitle: result.examTitle,
          score: result.score,
          totalMarks: result.totalMarks,
          percentage: result.percentage,
          status: result.status === 'PASS' ? 'PASSED' : 'FAILED',
          correctCount: result.correctAnswers,
          incorrectCount: result.incorrectAnswers,
          unansweredCount: result.unanswered
        };
      }
    }

    // DEMO mode
    await simulateDelay(350);

    const exam = await examService.getExamById(examId);
    const questions = await questionService.getExamQuestions(examId);

    let score = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const detailedResponses = {};

    questions.forEach((q) => {
      totalMarks += Number(q.marks || 2);
      const selectedOption = answers[q.id];

      if (!selectedOption) {
        unansweredCount++;
        detailedResponses[q.id] = {
          selected: null,
          correct: q.correctAnswer,
          isCorrect: false,
          marksAwarded: 0,
          maxMarks: q.marks || 2,
          topic: q.topic,
          explanation: q.explanation
        };
      } else if (selectedOption === q.correctAnswer) {
        correctCount++;
        const marks = Number(q.marks || 2);
        score += marks;
        detailedResponses[q.id] = {
          selected: selectedOption,
          correct: q.correctAnswer,
          isCorrect: true,
          marksAwarded: marks,
          maxMarks: marks,
          topic: q.topic,
          explanation: q.explanation
        };
      } else {
        incorrectCount++;
        detailedResponses[q.id] = {
          selected: selectedOption,
          correct: q.correctAnswer,
          isCorrect: false,
          marksAwarded: 0,
          maxMarks: q.marks || 2,
          topic: q.topic,
          explanation: q.explanation
        };
      }
    });

    const percentage = totalMarks > 0 ? Number(((score / totalMarks) * 100).toFixed(1)) : 0;
    const passingMarks = exam ? Number(exam.passingMarks || 0) : Math.round(totalMarks * 0.4);
    const isPassed = score >= passingMarks;

    const newAttempt = {
      id: `att-${Date.now()}`,
      examId,
      examTitle: exam ? exam.title : 'Assessment',
      subjectCode: exam ? exam.subjectCode : 'GEN101',
      subjectName: exam ? exam.subjectName : 'General Assessment',
      studentId: student?.id || 'std-53',
      studentName: student?.name || 'Bhavesh Thakur',
      studentRoll: student?.rollNo || '53',
      attemptDate: new Date().toISOString(),
      score,
      totalMarks,
      percentage,
      status: isPassed ? 'PASSED' : 'FAILED',
      passingMarks,
      durationSeconds: durationSeconds || 900,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      unansweredCount,
      responses: detailedResponses,
      questions
    };

    const attempts = getItem(STORAGE_KEYS.ATTEMPTS) || [];
    attempts.unshift(newAttempt);
    setItem(STORAGE_KEYS.ATTEMPTS, attempts);

    return newAttempt;
  }
};
