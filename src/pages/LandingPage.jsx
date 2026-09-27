import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useEnvironment } from '../context/EnvironmentContext';
import { Button } from '../components/common/Button';
import { EnvironmentSwitcher } from '../components/common/EnvironmentSwitcher';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Award,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Layers,
  ChevronRight,
  Sparkles,
  Users,
  Server
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { setIsProjectInfoOpen, teamInfo } = useEnvironment();
  const toast = useToast();

  const handleEnterStudent = () => {
    switchRole('student');
    toast.success('Signed in as Bhavesh Thakur (Student, Roll #53)');
    navigate('/student/dashboard');
  };

  const handleEnterAdmin = () => {
    switchRole('admin');
    toast.success('Signed in as Prof. Rajesh Verma (Faculty Admin)');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-8 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">{teamInfo.institution}</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">{teamInfo.department}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
            {teamInfo.academicYear} • {teamInfo.semester}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Exam<span className="text-indigo-600">Pulse</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                Enterprise Assessment System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* DEMO / LIVE Environment Switcher */}
            <EnvironmentSwitcher />

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                to="/student/login"
                className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Student Login
              </Link>
              <Link
                to="/admin/login"
                className="text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                Faculty Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none motion-reduce:hidden z-0"
          aria-hidden="true"
        >
          <source src="/videos/gemini_generated_video_07fab90b (2).mp4" type="video/mp4" />
          <source src="/assets/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Subtle Dark Navy Overlay for Crisp Text Readability */}
        <div className="absolute inset-0 bg-slate-950/75 mix-blend-multiply pointer-events-none z-0" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-indigo-950/90 pointer-events-none z-0" aria-hidden="true" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs px-3.5 py-1 rounded-full font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Full-Stack Online Quiz & Examination System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Academic Assessment Platform <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-blue-200 to-indigo-400">
              Built with Precision & Integrity
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Engineered for {teamInfo.institution} ({teamInfo.department}). Featuring real-time proctor countdowns, randomized MCQ banks, instantaneous automated grading, and role-based faculty analytics.
          </p>

          {/* Quick Dual Portal Launch Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={handleEnterStudent}
              className="w-full sm:w-auto shadow-xl shadow-indigo-500/25 bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              icon={GraduationCap}
            >
              Enter as Student (Bhavesh #53)
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleEnterAdmin}
              className="w-full sm:w-auto text-white border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600"
              icon={ShieldCheck}
            >
              Enter as Faculty Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Project & Team Highlight Card */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/60 via-slate-50 to-white border border-indigo-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{teamInfo.institution}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                {teamInfo.projectName} — {teamInfo.department}
              </h3>
              <p className="text-xs text-slate-600">
                Academic Project Team ({teamInfo.academicYear} • {teamInfo.semester})
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {teamInfo.team.map(m => (
                <div key={m.rollNo} className="flex items-center gap-2.5 px-3.5 py-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {m.rollNo}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">{m.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Roll No. {m.rollNo} {m.isLead && '• Lead'}</div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProjectInfoOpen(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Full Details
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise Examination Features
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Equipped with live countdown auto-submission, randomized item banking, and faculty audit analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Live Proctored Timers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Persistent countdown timer with threshold warnings and guaranteed zero-data-loss auto-submission at 00:00.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">DEMO / LIVE Dual Engine</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toggle seamlessly between standalone offline demo mock data and live Spring Boot 3 + MySQL 8.0 REST API execution.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Granular Performance Analytics</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Topic-wise mastery breakdown, class rank leaderboard, historical progression trends, and faculty cohort diagnostics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-8 px-4 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-white text-center sm:text-left">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold">{teamInfo.institution}</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="text-slate-400">{teamInfo.department}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-300 text-[11px]">
            <span className="text-slate-400">Team:</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-white">Bhavesh Thakur (53)</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-white">Atharva Chavan (6)</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-white">Aditya Mhaisekar (24)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
