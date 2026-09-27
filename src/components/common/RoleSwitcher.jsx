import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserCheck, Shield, RefreshCw, ChevronUp, ChevronDown, Check } from 'lucide-react';

export const RoleSwitcher = () => {
  const { role, switchRole, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  // Hide during live exam attempt to prevent distraction
  if (location.pathname.includes('/attempt')) {
    return null;
  }

  const handleRoleChange = (newRole) => {
    if (newRole === role) return;
    const res = switchRole(newRole);
    toast.info(`Switched role to ${newRole === 'admin' ? 'Faculty Admin (Prof. Rajesh Verma)' : 'Student (Aarav Sharma)'}`);
    
    if (newRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
    setExpanded(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-xl border border-slate-700/80 p-2 text-xs transition-all duration-200 min-w-[210px]">
        {/* Header / Toggle */}
        <div 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between gap-3 px-2 py-1 cursor-pointer hover:text-indigo-300 transition-colors select-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide text-slate-200">
              Demo Portal Switcher
            </span>
          </div>
          <button type="button" className="text-slate-400 hover:text-white">
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Current status pill */}
        <div className="mt-1 px-2 py-1 bg-slate-800/80 rounded-lg flex items-center justify-between text-[11px] text-slate-300">
          <span>Active Role:</span>
          <span className={`font-semibold capitalize px-1.5 py-0.5 rounded text-[10px] ${
            role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
          }`}>
            {role === 'admin' ? 'Faculty Admin' : 'Student'}
          </span>
        </div>

        {/* Expanded options */}
        {expanded && (
          <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
            <button
              onClick={() => handleRoleChange('student')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                role === 'student'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5" />
                <div>
                  <div className="leading-tight">Student View</div>
                  <div className="text-[10px] text-slate-300 opacity-80">Aarav Sharma (CS2024-042)</div>
                </div>
              </div>
              {role === 'student' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => handleRoleChange('admin')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <div>
                  <div className="leading-tight">Admin View</div>
                  <div className="text-[10px] text-slate-300 opacity-80">Prof. Rajesh Verma (Dean)</div>
                </div>
              </div>
              {role === 'admin' && <Check className="w-3.5 h-3.5" />}
            </button>

            <div className="pt-1.5 text-[10px] text-slate-400 px-1 border-t border-slate-800/80">
              Switch anytime to test faculties vs student exams.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
