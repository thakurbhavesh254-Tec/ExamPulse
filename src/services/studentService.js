// Student Service supporting DEMO and LIVE Spring Boot REST APIs

import { getItem, setItem, simulateDelay, STORAGE_KEYS, isLiveMode, liveRequest } from './apiClient';

export const studentService = {
  // GET /api/admin/students
  async getStudents(filters = {}) {
    if (isLiveMode()) {
      let endpoint = '/admin/students';
      if (filters.department && filters.department !== 'all') {
        endpoint += `?department=${encodeURIComponent(filters.department)}`;
      }
      let students = await liveRequest(endpoint);
      if (!Array.isArray(students)) students = [];

      students = students.map(s => ({
        id: s.id,
        name: s.name,
        rollNo: s.studentId,
        email: s.email,
        department: s.department || 'Information Technology',
        semester: '6th',
        attemptsCount: s.attemptsCount || 0,
        avgScore: s.avgScore || 0,
        status: 'Active',
        lastActive: 'Registered'
      }));

      if (filters.search) {
        const q = filters.search.toLowerCase();
        students = students.filter(s => 
          (s.name && s.name.toLowerCase().includes(q)) || 
          (s.rollNo && s.rollNo.toLowerCase().includes(q)) || 
          (s.email && s.email.toLowerCase().includes(q))
        );
      }
      return students;
    }

    await simulateDelay(120);
    let students = getItem(STORAGE_KEYS.STUDENTS) || [];

    if (filters.department && filters.department !== 'all') {
      students = students.filter(s => s.department === filters.department);
    }
    if (filters.status && filters.status !== 'all') {
      students = students.filter(s => s.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      students = students.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) || 
        (s.rollNo && s.rollNo.toLowerCase().includes(q)) || 
        (s.email && s.email.toLowerCase().includes(q))
      );
    }

    return students;
  },

  // GET /api/students/:id
  async getStudentById(id) {
    if (isLiveMode()) {
      const list = await this.getStudents();
      return list.find(s => String(s.id) === String(id)) || null;
    }
    await simulateDelay(100);
    const students = getItem(STORAGE_KEYS.STUDENTS) || [];
    return students.find(s => String(s.id) === String(id)) || null;
  }
};
