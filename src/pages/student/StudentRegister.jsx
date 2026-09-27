import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Hash,
  ArrowRight,
  CheckCircle2,
  Check,
  X
} from 'lucide-react';

export const StudentRegister = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = calculatePasswordStrength(formData.password);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'University email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID / Roll No is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        studentId: formData.studentId,
        department: formData.department,
        password: formData.password
      });
      toast.success(`Registration successful! Welcome, ${res.user?.name || formData.fullName}.`);
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to register account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Exam<span className="text-indigo-600">Pulse</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Student Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enroll your credentials for university examinations and proctored evaluations.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                id="fullName"
                placeholder="e.g. Aarav Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={errors.fullName}
                icon={User}
                required
              />

              <Input
                label="Student ID / Roll Number"
                id="studentId"
                placeholder="e.g. CS2024-042"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                error={errors.studentId}
                icon={Hash}
                required
              />
            </div>

            <Input
              label="University Email"
              id="email"
              type="email"
              placeholder="student.name@apexuniv.edu.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              icon={Mail}
              required
            />

            <Select
              label="Academic Department"
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={[
                { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering (CSE)' },
                { value: 'Information Technology', label: 'Information Technology (IT)' },
                { value: 'Data Science & AI', label: 'Data Science & AI (DS & AI)' },
                { value: 'Electronics & Communication', label: 'Electronics & Communication (ECE)' },
                { value: 'Applied Mathematics', label: 'Applied Mathematics (MA)' }
              ]}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                  icon={Lock}
                  required
                />

                {/* Password strength meter */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1.5 w-full">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 rounded-full transition-colors ${
                            strength >= step
                              ? strength <= 2
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>Strength</span>
                      <span className="font-semibold">
                        {strength <= 1 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                icon={Lock}
                required
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                By registering, you confirm your compliance with the University Code of Academic Integrity. 
                All examinations are logged with proctor audit trails.
              </span>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={ArrowRight}
              >
                Complete Registration
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/student/login" className="font-semibold text-indigo-600 hover:underline">
              Sign in with student ID
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
