import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { StudentLayout } from '../layouts/StudentLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Landing Page
import { LandingPage } from '../pages/LandingPage';

// Student Pages
import { StudentLogin } from '../pages/student/StudentLogin';
import { StudentRegister } from '../pages/student/StudentRegister';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { AvailableExams } from '../pages/student/AvailableExams';
import { ExamDetails } from '../pages/student/ExamDetails';
import { LiveExam } from '../pages/student/LiveExam';
import { ExamResult } from '../pages/student/ExamResult';
import { AttemptHistory } from '../pages/student/AttemptHistory';
import { StudentPerformance } from '../pages/student/StudentPerformance';
import { Leaderboard } from '../pages/student/Leaderboard';

// Admin Pages
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { SubjectManagement } from '../pages/admin/SubjectManagement';
import { ExamManagement } from '../pages/admin/ExamManagement';
import { QuestionBank } from '../pages/admin/QuestionBank';
import { ResultsManagement } from '../pages/admin/ResultsManagement';
import { AdminAnalytics } from '../pages/admin/AdminAnalytics';
import { StudentManagement } from '../pages/admin/StudentManagement';
import { AdminSettings } from '../pages/admin/AdminSettings';
import { Button } from '../components/common/Button';

// 404 Page
const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-black mb-4">
      404
    </div>
    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Page Not Found</h1>
    <p className="text-xs text-slate-500 max-w-sm mb-6">
      The requested examination resource or dashboard page does not exist or has been relocated.
    </p>
    <div className="flex items-center gap-3">
      <Link to="/student/dashboard">
        <Button variant="primary" size="sm">Go to Student Portal</Button>
      </Link>
      <Link to="/admin/dashboard">
        <Button variant="outline" size="sm">Go to Admin Console</Button>
      </Link>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Home & Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Student Authentication */}
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />

      {/* Live Exam Mode (Full screen proctored, outside standard navigation) */}
      <Route path="/student/exams/:id/attempt" element={<LiveExam />} />

      {/* Student Portal (With StudentLayout) */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exams" element={<AvailableExams />} />
        <Route path="exams/:id" element={<ExamDetails />} />
        <Route path="exams/:id/instructions" element={<ExamDetails />} />
        <Route path="results/:id" element={<ExamResult />} />
        <Route path="attempts" element={<AttemptHistory />} />
        <Route path="performance" element={<StudentPerformance />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Portal (With AdminLayout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="subjects" element={<SubjectManagement />} />
        <Route path="exams" element={<ExamManagement />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="results" element={<ResultsManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
