import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { EnvironmentSwitcher } from '../../components/common/EnvironmentSwitcher';
import {
  ShieldCheck,
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

export const AdminLogin = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('r.verma@apexuniv.edu.in');
  const [password, setPassword] = useState('DeanAdmin@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Faculty email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email, password, role: 'admin' });
      toast.success('Signed in as Prof. Rajesh Verma (Dean of Evaluations)');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('r.verma@apexuniv.edu.in');
    setPassword('DeanAdmin@2026');
    setErrors({});
    toast.info('Loaded faculty credentials (Prof. Rajesh Verma)');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white leading-none">
                  Exam<span className="text-indigo-400">Pulse</span>
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Faculty Administration Console</span>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Academic Faculty Sign In
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access institutional examination controls, question banks, and evaluation metrics.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">
              &larr; Back to Portal
            </Link>
            <EnvironmentSwitcher />
          </div>

          {/* Quick Demo Helper */}
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-900">
                <span className="font-semibold">Demo Administrator:</span> Prof. Rajesh Verma
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-white px-2 py-1 rounded shadow-2xs border border-amber-300 cursor-pointer"
            >
              Auto-fill
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Institutional Email"
              id="admin-email"
              type="email"
              placeholder="r.verma@apexuniv.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={Mail}
              required
            />

            <Input
              label="Admin Security Password"
              id="admin-password"
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
                <span>Keep session active</span>
              </label>

              <span className="text-slate-400">
                Faculty 2FA Enabled
              </span>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                isLoading={isLoading}
                rightIcon={ArrowRight}
              >
                Access Faculty Portal
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/student/login" className="font-medium text-indigo-600 hover:underline">
              &larr; Switch to Student Login
            </Link>
            <Link to="/" className="text-slate-500 hover:text-slate-800">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
