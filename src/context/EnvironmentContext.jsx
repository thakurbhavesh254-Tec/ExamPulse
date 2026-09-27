import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const EnvironmentContext = createContext(null);

export const ENVIRONMENTS = {
  DEMO: 'demo',
  LIVE: 'live'
};

const STORAGE_KEY = 'exampulse_environment';
const DEFAULT_API_URL = 'http://localhost:8080/api';

export const EnvironmentProvider = ({ children }) => {
  const [environment, setEnvironmentState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || ENVIRONMENTS.DEMO;
  });

  const [apiBaseUrl, setApiBaseUrl] = useState(() => {
    return localStorage.getItem('exampulse_api_url') || DEFAULT_API_URL;
  });

  const [backendStatus, setBackendStatus] = useState('checking'); // 'connected' | 'offline' | 'checking'
  const [lastChecked, setLastChecked] = useState(null);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);

  // Check Spring Boot backend health
  const checkBackendHealth = useCallback(async (customUrl) => {
    const url = customUrl || apiBaseUrl;
    setBackendStatus('checking');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      // Probe /health endpoint (publicly accessible in Spring Boot backend)
      const res = await fetch(`${url}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok || res.status === 401 || res.status === 403) {
        // Backend answered (even 401 indicates active Spring Security)
        setBackendStatus('connected');
      } else {
        // Fallback probe to /subjects
        try {
          const fallbackRes = await fetch(`${url}/subjects`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          });
          if (fallbackRes.ok || fallbackRes.status === 401 || fallbackRes.status === 403) {
            setBackendStatus('connected');
          } else {
            setBackendStatus('offline');
          }
        } catch {
          setBackendStatus('offline');
        }
      }
    } catch (err) {
      setBackendStatus('offline');
    } finally {
      setLastChecked(new Date());
    }
  }, [apiBaseUrl]);

  // When environment changes to LIVE, probe backend
  useEffect(() => {
    if (environment === ENVIRONMENTS.LIVE) {
      checkBackendHealth();
      const interval = setInterval(checkBackendHealth, 20000); // probe every 20s
      return () => clearInterval(interval);
    } else {
      setBackendStatus('connected'); // Demo mode always works
    }
  }, [environment, checkBackendHealth]);

  const setEnvironment = (newEnv) => {
    if (newEnv !== ENVIRONMENTS.DEMO && newEnv !== ENVIRONMENTS.LIVE) return;
    setEnvironmentState(newEnv);
    localStorage.setItem(STORAGE_KEY, newEnv);
    if (newEnv === ENVIRONMENTS.LIVE) {
      checkBackendHealth();
    }
  };

  const updateApiUrl = (newUrl) => {
    setApiBaseUrl(newUrl);
    localStorage.setItem('exampulse_api_url', newUrl);
    checkBackendHealth(newUrl);
  };

  const isLive = environment === ENVIRONMENTS.LIVE;
  const isDemo = environment === ENVIRONMENTS.DEMO;

  const teamInfo = {
    projectName: 'ExamPulse',
    tagline: 'Full-Stack Online Quiz & Examination System',
    institution: 'NHITM Engineering College',
    department: 'Department of Information Technology',
    academicYear: '2025–2026',
    semester: 'Semester VI',
    team: [
      {
        name: 'Bhavesh Thakur',
        rollNo: '53',
        role: 'Full Stack & System Architecture',
        isLead: true,
        email: 'bhavesh.thakur@nhitm.ac.in'
      },
      {
        name: 'Atharva Chavan',
        rollNo: '6',
        role: 'Frontend UI/UX & State Architecture',
        isLead: false,
        email: 'atharva.chavan@nhitm.ac.in'
      },
      {
        name: 'Aditya Mhaisekar',
        rollNo: '24',
        role: 'Backend Services & Database Design',
        isLead: false,
        email: 'aditya.mhaisekar@nhitm.ac.in'
      }
    ]
  };

  return (
    <EnvironmentContext.Provider
      value={{
        environment,
        setEnvironment,
        isLive,
        isDemo,
        apiBaseUrl,
        updateApiUrl,
        backendStatus,
        checkBackendHealth,
        lastChecked,
        teamInfo,
        isProjectInfoOpen,
        setIsProjectInfoOpen
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};
