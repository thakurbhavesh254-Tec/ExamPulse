import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Users,
  FileSpreadsheet,
  HelpCircle,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await analyticsService.getAdminAnalytics();
        setAnalytics(data);
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

  const {
    overview = {},
    participationTrend = [],
    departmentPerformance = [],
    recentActivity = [],
    hardestQuestions = []
  } = analytics || {};

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold mb-1 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Faculty Assessment Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Academic Examination Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time oversight of online tests, proctored submissions, and institutional pass metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/questions">
            <Button variant="outline" size="sm" leftIcon={HelpCircle}>
              Question Bank
            </Button>
          </Link>
          <Link to="/admin/exams">
            <Button variant="primary" size="sm" leftIcon={PlusCircle}>
              New Examination
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={overview?.totalStudents || 184}
          subtitle="Enrolled active candidates"
          icon={Users}
          trend={{ value: "+8 this week", positive: true }}
        />
        <StatCard
          title="Active Exams"
          value={overview?.totalExams || 5}
          subtitle="Scheduled this semester"
          icon={FileSpreadsheet}
          iconBg="bg-blue-50 text-blue-600"
          badge="Semester Active"
        />
        <StatCard
          title="Questions in Bank"
          value={overview?.totalQuestions || 246}
          subtitle="Across 6 core subjects"
          icon={HelpCircle}
          iconBg="bg-teal-50 text-teal-600"
        />
        <StatCard
          title="Total Submissions"
          value={overview?.totalAttempts || 942}
          subtitle={`Pass rate: ${overview?.avgPassRate || 76.4}%`}
          icon={Award}
          iconBg="bg-emerald-50 text-emerald-600"
          trend={{ value: "+12.4%", positive: true }}
        />
      </div>

      {/* Charts Section: Weekly Participation + Department Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Participation Trend (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Daily Exam Submissions & Active Students
              </h3>
              <p className="text-xs text-slate-500">
                Participation volume over the current academic week.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              Past 7 Days
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="attempts" name="Submissions" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="activeStudents" name="Active Candidates" fill="#93c5fd" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance Bar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
            Department Performance Index
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Average test scores achieved by department.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentPerformance || []}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="department" type="category" stroke="#94a3b8" fontSize={11} width={65} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none'
                  }}
                />
                <Bar dataKey="avgScore" name="Avg Score %" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Feed + Hardest Questions Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Activity Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Real-time Examination Audit Stream
            </h3>
            <Link to="/admin/results" className="text-xs font-semibold text-indigo-600 hover:underline">
              View All Submissions &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivity?.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{act.student}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{act.exam}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                    {act.score}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardest Questions Card (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Curriculum Friction Analysis
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Questions with lowest historical pass rates requiring revision:
          </p>

          <div className="space-y-3">
            {hardestQuestions?.map((hq) => (
              <div key={hq.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                    {hq.subject}
                  </span>
                  <span className="text-rose-600 font-bold">
                    {hq.failRate}% Error Rate
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-800 line-clamp-2">
                  {hq.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
