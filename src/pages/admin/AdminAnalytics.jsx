import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  TrendingUp,
  Award,
  Users,
  Target,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analyticsService.getAdminAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="stat" count={4} />
        <LoadingSkeleton variant="card" count={2} />
      </div>
    );
  }

  const { overview, participationTrend, departmentPerformance, hardestQuestions } = data;

  const DONUT_DATA = [
    { name: 'Cleared 1st Attempt', value: 74, color: '#10b981' },
    { name: 'Cleared Retake', value: 16, color: '#3b82f6' },
    { name: 'Remedial Required', value: 10, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Institutional Evaluation Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical outcomes, pass ratios, department benchmarks, and psychometric item analysis.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
          Academic Year 2025-2026 Active
        </span>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Pass Rate"
          value={`${overview?.avgPassRate || 76.4}%`}
          subtitle="Meets UGC benchmark (70%)"
          icon={Award}
          trend={{ value: "+3.2% vs last term", positive: true }}
        />
        <StatCard
          title="Mean Examination Score"
          value={`${overview?.overallAvgScore || 78.4}%`}
          subtitle="Across 940+ evaluations"
          icon={Target}
          trend={{ value: "+1.8%", positive: true }}
        />
        <StatCard
          title="Completion Rate"
          value="98.2%"
          subtitle="Candidate session retention"
          icon={CheckCircle2}
          iconBg="bg-teal-50 text-teal-600"
        />
        <StatCard
          title="Total Evaluated Papers"
          value={overview?.totalAttempts || 942}
          subtitle="Digital grading records"
          icon={Layers}
          iconBg="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Charts Section: Submissions trend + Pass Rate Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Participation Velocity (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Candidate Evaluation Activity
              </h3>
              <p className="text-xs text-slate-500">
                Weekly submission volume and concurrent test sessions.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Synchronized Live
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={participationTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '11px',
                    border: 'none'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attempts"
                  name="Exam Submissions"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4f46e5' }}
                />
                <Line
                  type="monotone"
                  dataKey="activeStudents"
                  name="Active Candidates"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pass / Fail Outcome Donut (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
            Institutional Clearance Ratio
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            First attempt vs re-examination clearance split.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DONUT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DONUT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Benchmark Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          Inter-Departmental Grade & Pass Rate Benchmark
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Comparing average exam score and passing percentage across academic engineering branches.
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentPerformance || []} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '11px',
                  border: 'none'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="avgScore" name="Average Score %" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={28} />
              <Bar dataKey="passRate" name="Pass Percentage %" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
