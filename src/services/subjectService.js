// Subject Service supporting DEMO and LIVE Spring Boot REST APIs

import { getItem, setItem, simulateDelay, STORAGE_KEYS, isLiveMode, liveRequest } from './apiClient';

export const subjectService = {
  // GET /api/subjects
  async getSubjects() {
    if (isLiveMode()) {
      return await liveRequest('/subjects');
    }
    await simulateDelay(150);
    return getItem(STORAGE_KEYS.SUBJECTS) || [];
  },

  // GET /api/subjects/:id
  async getSubjectById(id) {
    if (isLiveMode()) {
      return await liveRequest(`/subjects/${id}`);
    }
    await simulateDelay(100);
    const subjects = getItem(STORAGE_KEYS.SUBJECTS) || [];
    return subjects.find((s) => String(s.id) === String(id)) || null;
  },

  // POST /api/subjects
  async createSubject(subjectData) {
    if (isLiveMode()) {
      return await liveRequest('/subjects', {
        method: 'POST',
        body: JSON.stringify({
          code: subjectData.code,
          name: subjectData.name,
          department: subjectData.department || 'Information Technology',
          description: subjectData.description || ''
        })
      });
    }

    await simulateDelay(200);
    const subjects = getItem(STORAGE_KEYS.SUBJECTS) || [];
    const newSubject = {
      id: `sub-${Date.now()}`,
      examCount: 0,
      questionCount: 0,
      status: 'Active',
      color: '#2563EB',
      ...subjectData
    };
    subjects.unshift(newSubject);
    setItem(STORAGE_KEYS.SUBJECTS, subjects);
    return newSubject;
  },

  // PUT /api/subjects/:id
  async updateSubject(id, updatedData) {
    if (isLiveMode()) {
      return await liveRequest(`/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          code: updatedData.code,
          name: updatedData.name,
          department: updatedData.department,
          description: updatedData.description,
          status: updatedData.status || 'Active'
        })
      });
    }

    await simulateDelay(200);
    const subjects = getItem(STORAGE_KEYS.SUBJECTS) || [];
    const index = subjects.findIndex((s) => String(s.id) === String(id));
    if (index === -1) throw new Error('Subject not found');

    subjects[index] = { ...subjects[index], ...updatedData };
    setItem(STORAGE_KEYS.SUBJECTS, subjects);
    return subjects[index];
  },

  // DELETE /api/subjects/:id
  async deleteSubject(id) {
    if (isLiveMode()) {
      await liveRequest(`/subjects/${id}`, { method: 'DELETE' });
      return { success: true, id };
    }

    await simulateDelay(200);
    const subjects = getItem(STORAGE_KEYS.SUBJECTS) || [];
    const filtered = subjects.filter((s) => String(s.id) !== String(id));
    setItem(STORAGE_KEYS.SUBJECTS, filtered);
    return { success: true, id };
  }
};
