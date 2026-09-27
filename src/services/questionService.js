// Question Service supporting DEMO and LIVE Spring Boot REST APIs

import { getItem, setItem, simulateDelay, STORAGE_KEYS, isLiveMode, liveRequest } from './apiClient';

export const questionService = {
  // GET /api/questions
  async getQuestions(filters = {}) {
    if (isLiveMode()) {
      let endpoint = '/questions';
      if (filters.examId && filters.examId !== 'all') {
        endpoint = `/exams/${filters.examId}/questions`;
      }
      let questions = await liveRequest(endpoint);
      if (!Array.isArray(questions)) questions = [];

      // Map backend fields to frontend format
      questions = questions.map(q => ({
        id: q.id,
        examId: q.examId,
        examTitle: q.examTitle,
        subjectCode: q.subjectCode,
        text: q.questionText || q.text,
        questionText: q.questionText || q.text,
        options: [
          { id: 'A', text: q.optionA },
          { id: 'B', text: q.optionB },
          { id: 'C', text: q.optionC },
          { id: 'D', text: q.optionD }
        ],
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        marks: q.marks || 2,
        difficulty: q.difficulty || 'Medium',
        topic: q.topic || 'Core Subject',
        explanation: q.explanation || ''
      }));

      if (filters.difficulty && filters.difficulty !== 'all') {
        questions = questions.filter(q => q.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        questions = questions.filter(item => 
          (item.text && item.text.toLowerCase().includes(query)) ||
          (item.topic && item.topic.toLowerCase().includes(query))
        );
      }
      return questions;
    }

    await simulateDelay(150);
    let questions = getItem(STORAGE_KEYS.QUESTIONS) || [];

    if (filters.examId && filters.examId !== 'all') {
      questions = questions.filter(q => String(q.examId) === String(filters.examId));
    }
    if (filters.subjectId && filters.subjectId !== 'all') {
      questions = questions.filter(q => String(q.subjectId) === String(filters.subjectId));
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      questions = questions.filter(q => q.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      questions = questions.filter(item => 
        (item.text && item.text.toLowerCase().includes(q)) ||
        (item.topic && item.topic.toLowerCase().includes(q))
      );
    }

    return questions;
  },

  // GET questions for an exam
  async getExamQuestions(examId) {
    if (isLiveMode()) {
      const list = await liveRequest(`/exams/${examId}/questions`);
      return (list || []).map(q => ({
        id: q.id,
        examId: q.examId,
        text: q.questionText,
        questionText: q.questionText,
        options: [
          { id: 'A', text: q.optionA },
          { id: 'B', text: q.optionB },
          { id: 'C', text: q.optionC },
          { id: 'D', text: q.optionD }
        ],
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        marks: q.marks || 2,
        difficulty: q.difficulty || 'Medium',
        topic: q.topic || 'Core Subject',
        explanation: q.explanation || ''
      }));
    }

    await simulateDelay(120);
    const questions = getItem(STORAGE_KEYS.QUESTIONS) || [];
    const filtered = questions.filter(q => String(q.examId) === String(examId));
    if (filtered.length > 0) return filtered;
    return questions.slice(0, 5);
  },

  // GET /api/questions/:id
  async getQuestionById(id) {
    if (isLiveMode()) {
      return await liveRequest(`/questions/${id}`);
    }
    await simulateDelay(100);
    const questions = getItem(STORAGE_KEYS.QUESTIONS) || [];
    return questions.find(q => String(q.id) === String(id)) || null;
  },

  // POST /api/questions
  async createQuestion(questionData) {
    if (isLiveMode()) {
      const optA = questionData.options ? questionData.options[0]?.text : questionData.optionA;
      const optB = questionData.options ? questionData.options[1]?.text : questionData.optionB;
      const optC = questionData.options ? questionData.options[2]?.text : questionData.optionC;
      const optD = questionData.options ? questionData.options[3]?.text : questionData.optionD;

      return await liveRequest('/questions', {
        method: 'POST',
        body: JSON.stringify({
          examId: questionData.examId,
          questionText: questionData.text || questionData.questionText,
          optionA: optA || '',
          optionB: optB || '',
          optionC: optC || '',
          optionD: optD || '',
          correctAnswer: questionData.correctAnswer || 'A',
          marks: Number(questionData.marks) || 2,
          difficulty: questionData.difficulty || 'Medium',
          topic: questionData.topic || 'General Core',
          explanation: questionData.explanation || ''
        })
      });
    }

    await simulateDelay(200);
    const questions = getItem(STORAGE_KEYS.QUESTIONS) || [];
    const newQuestion = {
      id: `q-${Date.now()}`,
      marks: 2,
      difficulty: 'Medium',
      topic: 'General Core',
      explanation: 'Official faculty solution notes.',
      ...questionData
    };
    questions.unshift(newQuestion);
    setItem(STORAGE_KEYS.QUESTIONS, questions);
    return newQuestion;
  },

  // PUT /api/questions/:id
  async updateQuestion(id, updatedData) {
    if (isLiveMode()) {
      const optA = updatedData.options ? updatedData.options[0]?.text : updatedData.optionA;
      const optB = updatedData.options ? updatedData.options[1]?.text : updatedData.optionB;
      const optC = updatedData.options ? updatedData.options[2]?.text : updatedData.optionC;
      const optD = updatedData.options ? updatedData.options[3]?.text : updatedData.optionD;

      return await liveRequest(`/questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          questionText: updatedData.text || updatedData.questionText,
          optionA: optA || '',
          optionB: optB || '',
          optionC: optC || '',
          optionD: optD || '',
          correctAnswer: updatedData.correctAnswer,
          marks: Number(updatedData.marks),
          difficulty: updatedData.difficulty,
          topic: updatedData.topic,
          explanation: updatedData.explanation
        })
      });
    }

    await simulateDelay(200);
    const questions = getItem(STORAGE_KEYS.QUESTIONS) || [];
    const index = questions.findIndex(q => String(q.id) === String(id));
    if (index === -1) throw new Error('Question not found');

    questions[index] = { ...questions[index], ...updatedData };
    setItem(STORAGE_KEYS.QUESTIONS, questions);
    return questions[index];
  },

  // DELETE /api/questions/:id
  async deleteQuestion(id) {
    if (isLiveMode()) {
      await liveRequest(`/questions/${id}`, { method: 'DELETE' });
      return { success: true, id };
    }

    await simulateDelay(200);
    const questions = getItem(STORAGE_KEYS.QUESTIONS) || [];
    const filtered = questions.filter(q => String(q.id) !== String(id));
    setItem(STORAGE_KEYS.QUESTIONS, filtered);
    return { success: true, id };
  }
};
