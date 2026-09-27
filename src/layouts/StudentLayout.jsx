import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Avatar } from '../components/common/Avatar';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { EnvironmentSwitcher } from '../components/common/EnvironmentSwitcher';
import { useEnvironment } from '../context/EnvironmentContext';
import { 
  BookOpen, 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Trophy, 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  Shield, 
  User, 
  ChevronDown,
  GraduationCap
} from 'lucide-react';

export const StudentLayout = () => {
  const { user, logout, switchRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Available Exams', to: '/student/exams', icon: FileText },
    { label: 'Attempt History', to: '/student/attempts', icon: BookOpen },
    { label: 'Performance', to: '/student/performance', icon: BarChart3 },
    { label: 'Leaderboard', to: '/student/leaderboard', icon: Trophy },
  ];

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out from examination session');
    navigate('/student/login');
  };

  const handleSwitchToAdmin = () => {
    switchRole('admin');
    toast.success('Switched to Faculty Administrator Portal');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top University Brand Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium text-slate-200 truncate">
            Apex Institute of Science & Technology
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            National Assessment & Accreditation Portal (NAAC A++)
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="hidden sm:inline">Academic Session: 2025-2026</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System Secure
          </span>
        </div>
      </div>

      {/* Main Student Header */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-8">
              <Link to="/student/dashboard" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 group-hover:bg-indigo-700 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                      Exam<span className="text-indigo-600">Pulse</span>
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      STUDENT
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
                    Online Evaluation Platform
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Items */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Right Profile & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Environment Switcher */}
              <EnvironmentSwitcher />

              {/* Notification Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative cursor-pointer"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h4>
                      <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      <div className="p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer">
                        <p className="font-semibold text-slate-900">Upcoming Mid-Term Exam</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">CS301 Data Structures scheduled tomorrow at 09:30 AM.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                      </div>
                      <div className="p-3 text-xs hover:bg-slate-50 transition-colors cursor-pointer">
                        <p className="font-semibold text-slate-900">Exam Graded: CS302 DBMS Quiz</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">You scored 96.4% (Passed). Result analysis is available.</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Avatar src={user?.avatar} name={user?.name || 'Bhavesh Thakur'} size="sm" />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {user?.name || 'Bhavesh Thakur'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono leading-tight">
                      Roll #{user?.rollNo || '53'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {user?.department || 'Information Technology'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleSwitchToAdmin}
                        className="w-full text-left px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Switch to Faculty Admin</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* Student Footer */}
      <footer className="bg-white border-t border-slate-200/90 py-6 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-slate-900">ExamPulse</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="font-medium text-slate-700">NHITM Engineering College</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="text-slate-500">Department of Information Technology</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-500 text-[11px]">
            <span className="font-semibold text-slate-700">Team:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-medium">Bhavesh Thakur (53)</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-medium">Atharva Chavan (6)</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-medium">Aditya Mhaisekar (24)</span>
          </div>
        </div>
      </footer>

      {/* Floating Demo Role Switcher */}
      <RoleSwitcher />
    </div>
  );
};
