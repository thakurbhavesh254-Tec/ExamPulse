import React, { useState } from 'react';
import { useEnvironment, ENVIRONMENTS } from '../../context/EnvironmentContext';
import { useToast } from '../../context/ToastContext';
import { 
  Zap, 
  Radio, 
  RefreshCw, 
  Info, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown,
  GraduationCap
} from 'lucide-react';

export const EnvironmentSwitcher = ({ compact = false }) => {
  const { 
    environment, 
    setEnvironment, 
    isLive, 
    isDemo, 
    backendStatus, 
    checkBackendHealth,
    apiBaseUrl,
    setIsProjectInfoOpen 
  } = useEnvironment();

  const toast = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleSwitch = (mode) => {
    if (mode === environment) return;
    setEnvironment(mode);
    if (mode === ENVIRONMENTS.LIVE) {
      toast.info('Switched to LIVE Mode (Connecting to Spring Boot REST API at http://localhost:8080)...');
    } else {
      toast.success('Switched to DEMO Mode (Using local mock data & candidate profiles).');
    }
  };

  const handleManualCheck = async (e) => {
    e.stopPropagation();
    setIsChecking(true);
    await checkBackendHealth();
    setIsChecking(false);
    toast.info('Checked Spring Boot backend status.');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Segmented Switcher Control */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shadow-inner">
        <button
          type="button"
          onClick={() => handleSwitch(ENVIRONMENTS.DEMO)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer select-none ${
            isDemo
              ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Switch to Demo Mode (Standalone Mock Data)"
        >
          <Zap className={`w-3.5 h-3.5 ${isDemo ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
          <span>DEMO</span>
        </button>

        <button
          type="button"
          onClick={() => handleSwitch(ENVIRONMENTS.LIVE)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer select-none ${
            isLive
              ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Switch to Live Mode (Spring Boot REST API)"
        >
          <Radio className={`w-3.5 h-3.5 ${isLive ? 'text-white animate-pulse' : 'text-slate-400'}`} />
          <span>LIVE</span>
        </button>
      </div>

      {/* Mode Status Pill */}
      {isLive ? (
        <div className="relative">
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer select-none ${
              backendStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-500 ring-2 ring-amber-200 animate-ping'}`} />
            <span>{backendStatus === 'connected' ? 'Live API (8080)' : 'Backend Offline'}</span>
            <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
          </div>

          {/* Backend Status Dropdown */}
          {isMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in"
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Spring Boot REST API</h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{apiBaseUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={handleManualCheck}
                  disabled={isChecking}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Refresh Connection"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
              </div>

              <div className="py-2.5">
                <div className="flex items-center gap-2">
                  {backendStatus === 'connected' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-emerald-700">Connected to MySQL & Spring Boot</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="text-xs text-amber-800">
                        <span className="font-bold block">Spring Boot Server Offline</span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Run <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">mvn spring-boot:run</code> in the <code className="font-mono">backend/</code> directory.
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsProjectInfoOpen(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  View Team Info
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitch(ENVIRONMENTS.DEMO)}
                  className="text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Use Demo Mode
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>Demo Mode</span>
        </div>
      )}

      {/* Team / Project Info Button */}
      <button
        type="button"
        onClick={() => setIsProjectInfoOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50/60 border border-slate-200 transition-all cursor-pointer shadow-xs"
        title="Project Info & NHITM Engineering College Team"
      >
        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
        <span className="hidden md:inline">NHITM Team</span>
      </button>
    </div>
  );
};
