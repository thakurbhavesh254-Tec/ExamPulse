import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Avatar } from '../components/common/Avatar';
import { RoleSwitcher } from '../components/common/RoleSwitcher';
import { EnvironmentSwitcher } from '../components/common/EnvironmentSwitcher';
import {
  LayoutDashboard,
  FolderKanban,
  FileSpreadsheet,
  HelpCircle,
  Award,
  LineChart,
  Users,
  Settings,
  LogOut,
  UserCheck,
  Bell,
  Search,
  PlusCircle,
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout, switchRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminNotificationsOpen, setAdminNotificationsOpen] = useState(false);

  const adminNavItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Subjects', to: '/admin/subjects', icon: FolderKanban },
    { label: 'Exams', to: '/admin/exams', icon: FileSpreadsheet },
    { label: 'Question Bank', to: '/admin/questions', icon: HelpCircle },
    { label: 'Results & Attempts', to: '/admin/results', icon: Award },
    { label: 'Analytics', to: '/admin/analytics', icon: LineChart },
    { label: 'Students', to: '/admin/students', icon: Users },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out from Faculty Admin Console');
    navigate('/admin/login');
  };

  const handleSwitchToStudent = () => {
    switchRole('student');
    toast.success('Switched to Student Portal');
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row selection:bg-indigo-600 selection:text-white">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5 font-bold text-base">
            Exam<span className="text-indigo-400">Pulse</span>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-mono">ADMIN</span>
          </div>
        </div>
        <Avatar src={user?.avatar} name={user?.name || 'Prof. Verma'} size="sm" />
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-50 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white leading-none">
                  Exam<span className="text-indigo-400">Pulse</span>
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block mt-0.5">
                Academic Administration
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Badge */}
        <div className="px-4 py-3 mx-4 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Apex Inst. of Technology</p>
              <p className="text-[10px] text-slate-400">Office of Evaluations</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 px-3 py-2">
            Management Portal
          </div>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile & Role Switcher */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/40">
          <button
            onClick={handleSwitchToStudent}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs transition-colors cursor-pointer border border-slate-700/60"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Switch to Student View</span>
            </div>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">Demo</span>
          </button>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar src={user?.avatar} name={user?.name || 'Prof. Rajesh Verma'} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Prof. Rajesh Verma'}</p>
                <p className="text-[10px] text-slate-400 truncate">Dean of Evaluations</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Bar */}
        <header className="bg-white border-b border-slate-200/90 h-16 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search exams, subjects, questions, student roll..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Environment Switcher */}
            <EnvironmentSwitcher />

            <Link
              to="/admin/exams"
              className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Exam</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setAdminNotificationsOpen(!adminNotificationsOpen)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
                aria-label="Admin notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
              </button>

              {adminNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">Faculty Alerts</h4>
                    <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">Clear</span>
                  </div>
                  <div className="p-3 text-xs divide-y divide-slate-100 max-h-56 overflow-y-auto">
                    <div className="py-2">
                      <p className="font-semibold text-slate-900">14 Attempts Pending Review</p>
                      <p className="text-slate-500 text-[11px]">CS301 Mid-Term submissions require final moderation.</p>
                    </div>
                    <div className="py-2">
                      <p className="font-semibold text-slate-900">New Student Registrations</p>
                      <p className="text-slate-500 text-[11px]">5 students enrolled for 6th semester examinations.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-600">Spring 2026 Active</span>
            </div>
          </div>
        </header>

        {/* Admin Body Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-12">
          <Outlet />
        </main>

        {/* Admin Footer */}
        <footer className="bg-white border-t border-slate-200/90 py-5 px-4 sm:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <span className="font-bold text-slate-900">ExamPulse Faculty Console</span>
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
      </div>

      {/* Floating Demo Role Switcher */}
      <RoleSwitcher />
    </div>
  );
};
