import React from 'react';
import { useEnvironment } from '../../context/EnvironmentContext';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { 
  GraduationCap, 
  Users, 
  Server, 
  Database, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Code2, 
  Cpu, 
  Layers 
} from 'lucide-react';

export const ProjectInfoModal = () => {
  const { isProjectInfoOpen, setIsProjectInfoOpen, teamInfo, environment, backendStatus, apiBaseUrl } = useEnvironment();

  if (!isProjectInfoOpen) return null;

  return (
    <Modal
      isOpen={isProjectInfoOpen}
      onClose={() => setIsProjectInfoOpen(false)}
      title="Project Overview & Academic Team"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border border-indigo-800/40 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Capstone Examination Platform
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {environment === 'live' ? 'Live API Connected' : 'Interactive Demo Mode'}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                {teamInfo.projectName}
              </h2>
              <p className="text-sm text-slate-300 font-medium mt-1">
                {teamInfo.tagline}
              </p>
            </div>
            
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-200">{teamInfo.academicYear}</div>
              <div className="text-[11px] text-indigo-300">{teamInfo.semester}</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-white">{teamInfo.institution}</span>
            </div>
            <div className="text-slate-400 font-medium">
              {teamInfo.department}
            </div>
          </div>
        </div>

        {/* Project Team Members */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Development & Architecture Team</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {teamInfo.team.map((member) => (
              <div 
                key={member.rollNo}
                className={`p-4 rounded-xl border transition-all ${
                  member.isLead 
                    ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-500/20 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {member.rollNo}
                  </div>
                  {member.isLead ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      Team Lead
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                      Roll #{member.rollNo}
                    </span>
                  )}
                </div>

                <div className="font-bold text-slate-900 text-sm">
                  {member.name}
                </div>
                <div className="text-[11px] font-medium text-indigo-700 mt-0.5">
                  Roll No. {member.rollNo}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {member.role}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-2 truncate">
                  {member.email}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Architecture */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-700" />
            <span>Dual-Mode Architecture & Stack</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Frontend UI</span>
              <span className="font-bold text-slate-900">React 19 + Vite</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Tailwind v4 • Recharts</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Backend API</span>
              <span className="font-bold text-slate-900">Spring Boot 3.3</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Java 17 • Spring Web</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Database</span>
              <span className="font-bold text-slate-900">MySQL 8.0</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Hibernate JPA ORM</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Security</span>
              <span className="font-bold text-slate-900">JWT + BCrypt</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Role-Based Access</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900">Live API Base:</span>
              <code className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-800 font-mono text-[10px]">{apiBaseUrl}</code>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900">Status:</span>
              <span className={`inline-flex items-center gap-1 font-bold ${backendStatus === 'connected' ? 'text-emerald-700' : 'text-amber-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {backendStatus === 'connected' ? 'Connected' : 'Offline / Standalone'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
