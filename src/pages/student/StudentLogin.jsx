import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { EnvironmentSwitcher } from '../../components/common/EnvironmentSwitcher';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const StudentLogin = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('bhavesh.thakur@nhitm.ac.in');
  const [password, setPassword] = useState('ApexSecure@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'University email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await login({ email, password, role: 'student' });
      toast.success(`Welcome back, ${res.user?.name || 'Student'}! Signed in successfully.`);
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail = 'bhavesh.thakur@nhitm.ac.in', name = 'Bhavesh Thakur') => {
    setEmail(demoEmail);
    setPassword('ApexSecure@2026');
    setErrors({});
    toast.info(`Loaded student credentials for ${name}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Academic Branding */}
        <div className="hidden lg:flex lg:col-span-5 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl" />

          {/* Top Brand */}
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white leading-none">
                  Exam<span className="text-indigo-400">Pulse</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-0.5">
                  Apex Institute of Technology
                </span>
              </div>
            </Link>

            <div className="mt-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Examination Portal
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
                Academic Excellence Through Continuous Assessment.
              </h2>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                Access your scheduled university mid-terms, departmental quizzes, and real-time performance analytics under strict proctoring standards.
              </p>
            </div>
          </div>

          {/* Feature list */}
          <div className="relative z-10 space-y-4 my-8">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time countdown timer with autosave resilience</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instantaneous score calculation and topic-level breakdown</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Departmental cohort ranks & leaderboard badges</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-xs text-slate-500 pt-6 border-t border-slate-800 flex items-center justify-between">
            <span>Security Proctor v2.4</span>
            <span>NAAC A++ Certified</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900">ExamPulse</span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">
                &larr; Back to Portal
              </Link>
              <EnvironmentSwitcher />
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Student Sign In
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your university credentials to access the examination hall.
              </p>
            </div>

            {/* Demo Helper Banner with Multi-Student Quick Fill */}
            <div className="mb-6 p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-bold text-indigo-950">Quick Student Login Test Accounts:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleFillDemo('bhavesh.thakur@nhitm.ac.in', 'Bhavesh Thakur')}
                  className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 cursor-pointer shadow-2xs"
                >
                  Bhavesh (Roll #53)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('atharva.chavan@nhitm.ac.in', 'Atharva Chavan')}
                  className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 cursor-pointer shadow-2xs"
                >
                  Atharva (Roll #6)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('aditya.mhaisekar@nhitm.ac.in', 'Aditya Mhaisekar')}
                  className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 cursor-pointer shadow-2xs"
                >
                  Aditya (Roll #24)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('ananya.iyer@nhitm.ac.in', 'Ananya Iyer')}
                  className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 cursor-pointer shadow-2xs"
                >
                  Ananya (Roll #03)
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="University Email Address"
                id="email"
                type="email"
                placeholder="name@apexuniv.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={Mail}
                required
              />

              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={Lock}
                required
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Remember this device</span>
                </label>

                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Password reset requests should be submitted to the IT Desk (support@apexuniv.edu.in)');
                  }}
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </a>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={ArrowRight}
                >
                  Sign In to Examination Portal
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Not registered yet?{' '}
                <Link to="/student/register" className="font-semibold text-indigo-600 hover:underline">
                  Create student profile
                </Link>
              </div>
              <div>
                <Link to="/admin/login" className="font-semibold text-slate-700 hover:text-indigo-600 flex items-center gap-1">
                  <span>Faculty / Admin login</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
