// Authentication Service supporting DEMO and LIVE Spring Boot REST APIs

import { 
  getItem, 
  setItem, 
  simulateDelay, 
  STORAGE_KEYS, 
  isLiveMode, 
  liveRequest, 
  setAuthToken, 
  clearAuthToken 
} from './apiClient';
import { CURRENT_STUDENT, CURRENT_ADMIN } from '../data/mockData';

export const authService = {
  // POST /api/auth/login
  async login({ email, password, role = 'student' }) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (isLiveMode()) {
      // Connect to real Spring Boot REST API
      const response = await liveRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      // Save token & user
      setAuthToken(response.token);

      const userRole = (response.role === 'ROLE_ADMIN' || response.role === 'ADMIN') ? 'admin' : 'student';
      const userObj = {
        id: response.id || `user-${response.id}`,
        name: response.name,
        email: response.email,
        studentId: response.studentId || '',
        rollNo: response.studentId || '',
        department: response.department || 'Information Technology',
        role: userRole,
        avatar: response.avatar || (userRole === 'admin' 
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256'
          : null),
        institution: 'NHITM Engineering College'
      };

      setItem(STORAGE_KEYS.CURRENT_ROLE, userRole);
      setItem(STORAGE_KEYS.CURRENT_USER, userObj);

      return {
        success: true,
        token: response.token,
        role: userRole,
        user: userObj
      };
    }

    // DEMO mode with mock delay
    await simulateDelay(250);

    const user = role === 'admin' 
      ? { ...CURRENT_ADMIN, email } 
      : { ...CURRENT_STUDENT, email, avatar: null };

    setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    setItem(STORAGE_KEYS.CURRENT_USER, user);

    return {
      success: true,
      token: 'jwt-mock-token-xyz789',
      role,
      user
    };
  },

  // POST /api/auth/register
  async register({ fullName, email, password, studentId, department }) {
    if (!fullName || !email || !password) {
      throw new Error('Please fill in all mandatory fields');
    }

    if (isLiveMode()) {
      const response = await liveRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          studentId: studentId || `STD-${Date.now().toString().slice(-4)}`,
          department: department || 'Department of Information Technology'
        })
      });

      setAuthToken(response.token);

      const userRole = (response.role === 'ROLE_ADMIN' || response.role === 'ADMIN') ? 'admin' : 'student';
      const userObj = {
        id: response.id || `user-${response.id}`,
        name: response.name,
        email: response.email,
        studentId: response.studentId,
        rollNo: response.studentId,
        department: response.department,
        role: userRole,
        avatar: null,
        institution: 'NHITM Engineering College'
      };

      setItem(STORAGE_KEYS.CURRENT_ROLE, userRole);
      setItem(STORAGE_KEYS.CURRENT_USER, userObj);

      return {
        success: true,
        user: userObj,
        token: response.token
      };
    }

    // DEMO mode
    await simulateDelay(300);

    const newUser = {
      id: `std-${Date.now()}`,
      name: fullName,
      rollNo: studentId || '53',
      email,
      department: department || 'Department of Information Technology',
      semester: '6th Semester',
      academicYear: '2025-2026',
      institution: 'NHITM Engineering College',
      avatar: null,
      overallRank: 1,
      totalStudents: 185,
      gpa: 9.6
    };

    const students = getItem(STORAGE_KEYS.STUDENTS) || [];
    students.push({
      id: newUser.id,
      name: newUser.name,
      rollNo: newUser.rollNo,
      email: newUser.email,
      department: newUser.department,
      semester: newUser.semester,
      attemptsCount: 0,
      avgScore: 0,
      status: 'Active',
      lastActive: 'Just registered'
    });
    setItem(STORAGE_KEYS.STUDENTS, students);

    setItem(STORAGE_KEYS.CURRENT_ROLE, 'student');
    setItem(STORAGE_KEYS.CURRENT_USER, newUser);

    return {
      success: true,
      user: newUser,
      token: 'jwt-mock-registered-token-456'
    };
  },

  // GET /api/auth/me
  async getCurrentUserProfile() {
    if (isLiveMode()) {
      try {
        const user = await liveRequest('/auth/me');
        return user;
      } catch (e) {
        return getItem(STORAGE_KEYS.CURRENT_USER) || CURRENT_STUDENT;
      }
    }
    return getItem(STORAGE_KEYS.CURRENT_USER) || CURRENT_STUDENT;
  },

  getCurrentUser() {
    return getItem(STORAGE_KEYS.CURRENT_USER) || CURRENT_STUDENT;
  },

  getCurrentRole() {
    return getItem(STORAGE_KEYS.CURRENT_ROLE) || 'student';
  },

  switchRole(role) {
    if (role === 'admin') {
      setItem(STORAGE_KEYS.CURRENT_ROLE, 'admin');
      setItem(STORAGE_KEYS.CURRENT_USER, CURRENT_ADMIN);
      return { role: 'admin', user: CURRENT_ADMIN };
    } else {
      setItem(STORAGE_KEYS.CURRENT_ROLE, 'student');
      setItem(STORAGE_KEYS.CURRENT_USER, CURRENT_STUDENT);
      return { role: 'student', user: CURRENT_STUDENT };
    }
  },

  async logout() {
    clearAuthToken();
    if (!isLiveMode()) {
      await simulateDelay(100);
    }
    return { success: true };
  }
};
