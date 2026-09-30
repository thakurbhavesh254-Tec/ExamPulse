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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white relative overflow-hidden">
      {/* Continuous Full-Page 3D Visual Environment */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Layer 1: Dark Navy / Midnight Blue Base Gradient */}
        <div className="absolute inset-0 bg-slate-950 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950" />
        
        {/* Layer 2 & 3: 3D Campus & Technology Visual Environment Image */}
        <img
          src="/assets/exampulse_3d_background.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity scale-105"
        />

        {/* Layer 4: Soft Blue & Violet Atmospheric Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-indigo-950/85 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Layer 5: Faint Digital Network Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b20_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      </div>

      {/* Top Banner */}
      <div className="relative z-20 bg-slate-950/90 backdrop-blur-md text-slate-300 text-xs px-4 sm:px-8 py-2 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">{teamInfo.institution}</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">{teamInfo.department}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] bg-indigo-950/80 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-800/60 shadow-xs">
            {teamInfo.academicYear} • {teamInfo.semester}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3 sticky top-0 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-md">
              <img
                src="/assets/nhitm-official-logo.png"
                alt="NHITM College Logo"
                className="h-8 w-auto object-contain pointer-events-none"
              />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                Exam<span className="text-indigo-400">Pulse</span>
              </span>
              <span className="text-[10px] text-indigo-300/80 font-semibold tracking-wider uppercase block">
                NHITM Enterprise System
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* DEMO / LIVE Environment Switcher */}
            <EnvironmentSwitcher />

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <Link
                to="/student/login"
                className="text-xs font-semibold text-slate-300 hover:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                Student Login
              </Link>
              <Link
                to="/admin/login"
                className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-sm shadow-indigo-600/30 border border-indigo-400/20"
              >
                Faculty Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 overflow-hidden text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-950/60 backdrop-blur-md border border-indigo-500/30 text-indigo-300 text-xs px-3.5 py-1 rounded-full font-medium mb-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Full-Stack Online Quiz & Examination System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Academic Assessment Platform <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-blue-200 to-indigo-400">
              Built with Precision & Integrity
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Engineered for {teamInfo.institution} ({teamInfo.department}). Featuring real-time proctor countdowns, randomized MCQ banks, instantaneous automated grading, and role-based faculty analytics.
          </p>

          {/* Quick Dual Portal Launch Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={handleEnterStudent}
              className="w-full sm:w-auto shadow-xl shadow-indigo-600/30 bg-indigo-600 hover:bg-indigo-500 text-white font-bold border border-indigo-400/20"
              icon={GraduationCap}
            >
              Enter as Student (Bhavesh #53)
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleEnterAdmin}
              className="w-full sm:w-auto text-white border-slate-700 bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 hover:border-slate-600"
              icon={ShieldCheck}
            >
              Enter as Faculty Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Project & Team Highlight Card */}
      <section className="relative z-10 py-10 border-t border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-indigo-500/20 shadow-2xl shadow-black/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{teamInfo.institution}</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                {teamInfo.projectName} — {teamInfo.department}
              </h3>
              <p className="text-xs text-slate-400">
                Academic Project Team ({teamInfo.academicYear} • {teamInfo.semester})
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {teamInfo.team.map(m => (
                <div key={m.rollNo} className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-800/70 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-md">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {m.rollNo}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Roll No. {m.rollNo} {m.isLead && '• Lead'}</div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProjectInfoOpen(true)}
                className="text-xs font-semibold text-indigo-300 border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/60 hover:text-white"
              >
                Full Details
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="relative z-10 py-16 bg-slate-950/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Enterprise Examination Features
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Equipped with live countdown auto-submission, randomized item banking, and faculty audit analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 shadow-xl shadow-black/40 transition-all hover:translate-y-[-2px]">
              <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/50 text-indigo-400 flex items-center justify-center mb-4 font-bold shadow-inner">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Live Proctored Timers</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Persistent countdown timer with threshold warnings and guaranteed zero-data-loss auto-submission at 00:00.
              </p>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 shadow-xl shadow-black/40 transition-all hover:translate-y-[-2px]">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 flex items-center justify-center mb-4 font-bold shadow-inner">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">DEMO / LIVE Dual Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toggle seamlessly between standalone offline demo mock data and live Spring Boot 3 + MySQL 8.0 REST API execution.
              </p>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 shadow-xl shadow-black/40 transition-all hover:translate-y-[-2px]">
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/50 text-purple-400 flex items-center justify-center mb-4 font-bold shadow-inner">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Granular Performance Analytics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Topic-wise mastery breakdown, class rank leaderboard, historical progression trends, and faculty cohort diagnostics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto bg-slate-950/90 backdrop-blur-md text-slate-400 py-8 px-4 text-xs border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-white text-center sm:text-left">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold">{teamInfo.institution}</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="text-slate-400">{teamInfo.department}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-300 text-[11px]">
            <span className="text-slate-400">Team:</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-white">Bhavesh Thakur (53)</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-white">Atharva Chavan (6)</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-white">Aditya Mhaisekar (24)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
