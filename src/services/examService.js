// Exam Service supporting DEMO and LIVE Spring Boot REST APIs

import { getItem, setItem, simulateDelay, STORAGE_KEYS, isLiveMode, liveRequest } from './apiClient';

export const examService = {
  // GET /api/exams
  async getExams(filters = {}) {
    if (isLiveMode()) {
      let exams = await liveRequest('/exams');
      if (!Array.isArray(exams)) exams = [];

      // Map backend fields to frontend format if needed
      exams = exams.map(e => ({
        id: e.id,
        code: e.code,
        title: e.title,
        description: e.description,
        subjectId: e.subject?.id || e.subjectId,
        subjectCode: e.subject?.code || e.subjectCode,
        subjectName: e.subject?.name || e.subjectName,
        durationMinutes: e.durationMinutes,
        duration: `${e.durationMinutes} mins`,
        totalMarks: e.totalMarks,
        passingMarks: e.passingMarks,
        difficulty: e.difficulty || 'Medium',
        status: e.published ? 'Published' : 'Draft',
        questionCount: e.questions?.length || e.questionCount || 0,
        attemptsCount: e.attemptsCount || 0,
        passRate: e.passRate || 85,
        avgScore: e.avgScore || 78,
        instructions: Array.isArray(e.instructions) ? e.instructions : (e.instructions ? e.instructions.split('\n') : [])
      }));

      if (filters.subjectId && filters.subjectId !== 'all') {
        exams = exams.filter(e => String(e.subjectId) === String(filters.subjectId));
      }
      if (filters.difficulty && filters.difficulty !== 'all') {
        exams = exams.filter(e => e.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
      }
      if (filters.status && filters.status !== 'all') {
        exams = exams.filter(e => e.status.toLowerCase() === filters.status.toLowerCase());
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        exams = exams.filter(e => 
          (e.title && e.title.toLowerCase().includes(q)) || 
          (e.subjectName && e.subjectName.toLowerCase().includes(q)) ||
          (e.code && e.code.toLowerCase().includes(q))
        );
      }
      return exams;
    }

    await simulateDelay(150);
    let exams = getItem(STORAGE_KEYS.EXAMS) || [];

    if (filters.subjectId && filters.subjectId !== 'all') {
      exams = exams.filter(e => String(e.subjectId) === String(filters.subjectId));
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      exams = exams.filter(e => e.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }
    if (filters.status && filters.status !== 'all') {
      exams = exams.filter(e => e.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      exams = exams.filter(e => 
        e.title.toLowerCase().includes(q) || 
        (e.subjectName && e.subjectName.toLowerCase().includes(q)) ||
        (e.code && e.code.toLowerCase().includes(q))
      );
    }

    return exams;
  },

  // GET /api/exams/:id
  async getExamById(id) {
    if (isLiveMode()) {
      const e = await liveRequest(`/exams/${id}`);
      return {
        id: e.id,
        code: e.code,
        title: e.title,
        description: e.description,
        subjectId: e.subject?.id || e.subjectId,
        subjectCode: e.subject?.code || e.subjectCode,
        subjectName: e.subject?.name || e.subjectName,
        durationMinutes: e.durationMinutes,
        duration: `${e.durationMinutes} mins`,
        totalMarks: e.totalMarks,
        passingMarks: e.passingMarks,
        difficulty: e.difficulty || 'Medium',
        status: e.published ? 'Published' : 'Draft',
        questionCount: e.questions?.length || e.questionCount || 0,
        attemptsCount: e.attemptsCount || 0,
        instructions: Array.isArray(e.instructions) ? e.instructions : (e.instructions ? e.instructions.split('\n') : [])
      };
    }

    await simulateDelay(120);
    const exams = getItem(STORAGE_KEYS.EXAMS) || [];
    return exams.find(e => String(e.id) === String(id)) || null;
  },

  // POST /api/exams
  async createExam(examData) {
    if (isLiveMode()) {
      return await liveRequest('/exams', {
        method: 'POST',
        body: JSON.stringify({
          code: examData.code || `EX-${Math.floor(1000 + Math.random() * 9000)}`,
          title: examData.title,
          description: examData.description || '',
          subjectId: examData.subjectId,
          durationMinutes: Number(examData.durationMinutes) || 45,
          totalMarks: Number(examData.totalMarks) || 100,
          passingMarks: Number(examData.passingMarks) || 40,
          difficulty: examData.difficulty || 'Medium',
          instructions: Array.isArray(examData.instructions) ? examData.instructions.join('\n') : (examData.instructions || ''),
          published: examData.status === 'Published',
          attemptsAllowed: Number(examData.attemptsAllowed) || 2
        })
      });
    }

    await simulateDelay(250);
    const exams = getItem(STORAGE_KEYS.EXAMS) || [];
    const newExam = {
      id: `exam-${Date.now()}`,
      code: `EX-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Published',
      attemptsCount: 0,
      passRate: 0,
      avgScore: 0,
      scheduledStart: new Date().toISOString(),
      scheduledEnd: new Date(Date.now() + 14 * 86400000).toISOString(),
      tags: ['University Exam'],
      instructions: [
        'Read each question carefully before submitting.',
        'Negative marking is not applied unless stated.',
        'Do not refresh or leave the examination tab.'
      ],
      ...examData
    };
    exams.unshift(newExam);
    setItem(STORAGE_KEYS.EXAMS, exams);
    return newExam;
  },

  // PUT /api/exams/:id
  async updateExam(id, updatedData) {
    if (isLiveMode()) {
      return await liveRequest(`/exams/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          code: updatedData.code,
          title: updatedData.title,
          description: updatedData.description,
          subjectId: updatedData.subjectId,
          durationMinutes: Number(updatedData.durationMinutes),
          totalMarks: Number(updatedData.totalMarks),
          passingMarks: Number(updatedData.passingMarks),
          difficulty: updatedData.difficulty,
          instructions: Array.isArray(updatedData.instructions) ? updatedData.instructions.join('\n') : updatedData.instructions,
          published: updatedData.status === 'Published',
          attemptsAllowed: Number(updatedData.attemptsAllowed) || 2
        })
      });
    }

    await simulateDelay(200);
    const exams = getItem(STORAGE_KEYS.EXAMS) || [];
    const index = exams.findIndex(e => String(e.id) === String(id));
    if (index === -1) throw new Error('Exam not found');

    exams[index] = { ...exams[index], ...updatedData };
    setItem(STORAGE_KEYS.EXAMS, exams);
    return exams[index];
  },

  // DELETE /api/exams/:id
  async deleteExam(id) {
    if (isLiveMode()) {
      await liveRequest(`/exams/${id}`, { method: 'DELETE' });
      return { success: true, id };
    }

    await simulateDelay(200);
    const exams = getItem(STORAGE_KEYS.EXAMS) || [];
    const filtered = exams.filter(e => String(e.id) !== String(id));
    setItem(STORAGE_KEYS.EXAMS, filtered);
    return { success: true, id };
  },

  // POST /api/exams/:id/toggle-publish
  async togglePublish(id) {
    if (isLiveMode()) {
      return await liveRequest(`/exams/${id}/publish`, { method: 'PATCH' });
    }

    await simulateDelay(150);
    const exams = getItem(STORAGE_KEYS.EXAMS) || [];
    const index = exams.findIndex(e => String(e.id) === String(id));
    if (index === -1) throw new Error('Exam not found');

    const newStatus = exams[index].status === 'Published' ? 'Draft' : 'Published';
    exams[index].status = newStatus;
    setItem(STORAGE_KEYS.EXAMS, exams);
    return exams[index];
  },

  // POST /api/exams/:id/duplicate
  async duplicateExam(id) {
    if (isLiveMode()) {
      return await liveRequest(`/exams/${id}/duplicate`, { method: 'POST' });
    }

    await simulateDelay(200);
    const exams = getItem(STORAGE_KEYS.EXAMS) || [];
    const original = exams.find(e => String(e.id) === String(id));
    if (!original) throw new Error('Exam not found');

    const duplicate = {
      ...original,
      id: `exam-${Date.now()}`,
      code: `${original.code}-COPY`,
      title: `${original.title} (Copy)`,
      status: 'Draft',
      attemptsCount: 0
    };
    exams.unshift(duplicate);
    setItem(STORAGE_KEYS.EXAMS, exams);
    return duplicate;
  }
};
