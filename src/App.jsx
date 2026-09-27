import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EnvironmentProvider } from './context/EnvironmentContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './routes/AppRoutes';
import { ProjectInfoModal } from './components/common/ProjectInfoModal';

export default function App() {
  return (
    <BrowserRouter>
      <EnvironmentProvider>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
            <ProjectInfoModal />
          </AuthProvider>
        </ToastProvider>
      </EnvironmentProvider>
    </BrowserRouter>
  );
}
