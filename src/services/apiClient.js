// Central API client supporting both DEMO (Mock Data) and LIVE (Spring Boot REST API) modes

import {
  INITIAL_SUBJECTS,
  INITIAL_QUESTIONS,
  INITIAL_EXAMS,
  INITIAL_ATTEMPTS,
  INITIAL_STUDENTS,
  CURRENT_STUDENT,
  CURRENT_ADMIN,
  LEADERBOARD_DATA,
  PERFORMANCE_ANALYTICS,
  ADMIN_ANALYTICS
} from '../data/mockData';

const STORAGE_KEYS = {
  SUBJECTS: 'exampulse_subjects',
  QUESTIONS: 'exampulse_questions',
  EXAMS: 'exampulse_exams',
  ATTEMPTS: 'exampulse_attempts',
  STUDENTS: 'exampulse_students',
  CURRENT_USER: 'exampulse_current_user',
  CURRENT_ROLE: 'exampulse_current_role',
  JWT_TOKEN: 'exampulse_jwt_token',
  ENVIRONMENT: 'exampulse_environment',
  API_URL: 'exampulse_api_url'
};

const DEFAULT_API_URL = 'http://localhost:8080/api';

// Check if currently running in LIVE mode
export const isLiveMode = () => {
  return localStorage.getItem(STORAGE_KEYS.ENVIRONMENT) === 'live';
};

export const getApiBaseUrl = () => {
  return localStorage.getItem(STORAGE_KEYS.API_URL) || DEFAULT_API_URL;
};

export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.JWT_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
};

// LIVE REST API Request Handler
export const liveRequest = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || (data?.errors ? Object.values(data.errors).join(', ') : `HTTP Error ${response.status}: ${response.statusText}`);
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const offlineError = new Error(`Cannot connect to Spring Boot backend at ${baseUrl}. Please ensure your Spring Boot server is running on port 8080.`);
      offlineError.isOffline = true;
      offlineError.status = 503;
      throw offlineError;
    }
    throw err;
  }
};

// Initialize localStorage for DEMO mode if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_ATTEMPTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'student');
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(CURRENT_STUDENT));
  } else {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
      if (stored && (stored.name === 'Aarav Sharma' || stored.avatar?.includes('unsplash') || stored.rollNo === 'CS2024-042')) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(CURRENT_STUDENT));
      }
    } catch (e) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(CURRENT_STUDENT));
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENVIRONMENT)) {
    localStorage.setItem(STORAGE_KEYS.ENVIRONMENT, 'demo');
  }
};

initializeStorage();

export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing to localStorage key', key, e);
  }
};

export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(INITIAL_ATTEMPTS));
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(CURRENT_STUDENT));
};

// Helper for simulated network delay in demo mode
export const simulateDelay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export { STORAGE_KEYS };
