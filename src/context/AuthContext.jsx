import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [role, setRole] = useState(() => authService.getCurrentRole());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const activeRole = authService.getCurrentRole();
    const activeUser = authService.getCurrentUser();
    setRole(activeRole);
    setUser(activeUser);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      setUser(res.user);
      setRole(res.role);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (studentData) => {
    setIsLoading(true);
    try {
      const res = await authService.register(studentData);
      setUser(res.user);
      setRole('student');
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole) => {
    const updated = authService.switchRole(newRole);
    setRole(updated.role);
    setUser(updated.user);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
