import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowUpRight
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

export const StudentPerformance = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const studentId = user?.id || user?.studentId;
        const res = await analyticsService.getStudentAnalytics(studentId);
        setData(res);
      } catch (err) {
        console.error('Failed to load performance analytics', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <LoadingSkeleton variant="stat" count={4} />
        <LoadingSkeleton variant="card" count={2} />
      </div>
    );
  }

  const PIE_COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Performance & Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comprehensive evaluation metrics, accuracy trends, and subject-wise mastery benchmarks.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <Flame className="w-4 h-4 text-emerald-600" />
          <span>4-Week Continuous Evaluation Streak</span>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cumulative Grade Point"
          value="8.92 GPA"
          subtitle="Top 5% of CSE Cohort"
          icon={Award}
          trend={{ value: "+0.4 this sem", positive: true }}
        />
        <StatCard
          title="Average Exam Score"
          value={`${data?.averageScore || 84.6}%`}
          subtitle="Institute standard: 70%"
          icon={Target}
          trend={{ value: "+14.8%", positive: true }}
        />
        <StatCard
          title="Total Evaluations"
          value={`${data?.totalAttemptsCount || 3} Completed`}
          subtitle="Zero unattempted exams"
          icon={BookOpen}
          badge="100% On-time"
        />
        <StatCard
          title="Accuracy Ratio"
          value="91.2%"
          subtitle="High confidence rating"
          icon={CheckCircle2}
          iconBg="bg-teal-50 text-teal-600"
        />
      </div>

      {/* Highlights & AI Insights Callout */}
      <div className="bg-linear-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2.5 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Academic Mastery Insights
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-indigo-100">
          {(data?.insights || [
            "Your average score improved by 14.8% compared with previous evaluations.",
            "Strongest domain: Operating Systems & Process Synchronization (95% accuracy).",
            "Suggested focus: Complex Hashing with Quadratic Probing & B+ Tree Splits.",
            "You have maintained an active evaluation streak for 4 consecutive weeks."
          ]).map((ins, i) => (
            <div key={i} className="flex items-start gap-2.5 bg-white/5 p-3.5 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
              <span>{ins}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section: Line Progression + Subject Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Score progression over time (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Exam-by-Exam Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Performance across consecutive test sessions.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Upward Velocity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.scoreTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="exam" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Your Score"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  name="Class Average"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pass / Fail Distribution Donut (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
            Evaluation Outcome Ratio
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            First attempt vs re-attempt status.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.passFailDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.passFailDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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

      {/* Bottom Chart: Subject-wise Performance Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          Subject-wise Mastery Distribution
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Aggregate percentage attained across core computer science departments.
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.subjectBreakdown || []}
              margin={{ top: 10, right: 20, left: -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} interval={0} angle={-10} textAnchor="end" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '12px',
                  border: 'none'
                }}
              />
              <Bar dataKey="score" name="Mastery %" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
