import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { examService } from '../../services/examService';
import { resultService } from '../../services/resultService';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/common/StatCard';
import { ExamCard } from '../../components/student/ExamCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  FileText,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Trophy,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [examsData, attemptsData, analyticsData, leaderboardData] = await Promise.all([
          examService.getExams(),
          resultService.getStudentAttempts(user?.id || 'std-53'),
          analyticsService.getStudentAnalytics(user?.id || 'std-53'),
          analyticsService.getLeaderboard()
        ]);
        setExams(examsData);
        setAttempts(attemptsData);
        setAnalytics(analyticsData);
        setLeaderboard(leaderboardData);
      } catch (err) {
        console.error('Failed to load student dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <LoadingSkeleton variant="stat" count={4} />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  const passedAttempts = attempts.filter((a) => a.status === 'PASSED');
  const availableExams = exams.filter((e) => e.status === 'Published');
  const avgScore = attempts.length > 0
    ? (attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / attempts.length).toFixed(1)
    : '96.4';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Greeting Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Semester Active &bull; Roll: {user?.rollNo || '53'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Bhavesh'}!
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            You are enrolled in <span className="text-white font-medium">{user?.department || 'Department of Information Technology'}</span>. 
            You have <span className="text-indigo-300 font-semibold">{availableExams.length} examinations</span> available for evaluation this week.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/student/exams">
              <Button size="md" variant="primary" rightIcon={ArrowRight}>
                Explore Available Exams
              </Button>
            </Link>
            <Link to="/student/performance">
              <Button size="md" variant="secondary" className="bg-slate-800/90 hover:bg-slate-800 text-slate-200">
                View Performance Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Exams Attempted"
          value={attempts.length}
          subtitle="All completed evaluations"
          icon={FileText}
          iconBg="bg-blue-50 text-blue-600"
          trend={{ value: "+2 this month", positive: true }}
        />
        <StatCard
          title="Average Score"
          value={`${avgScore}%`}
          subtitle="Across graded papers"
          icon={Award}
          iconBg="bg-emerald-50 text-emerald-600"
          badge="First Class Distinction"
          trend={{ value: "+14.8%", positive: true }}
        />
        <StatCard
          title="Passed Papers"
          value={`${passedAttempts.length}/${attempts.length}`}
          subtitle="100% clearing rate"
          icon={CheckCircle2}
          iconBg="bg-teal-50 text-teal-600"
        />
        <StatCard
          title="Available Tests"
          value={availableExams.length}
          subtitle="Ready to take now"
          icon={Clock}
          iconBg="bg-indigo-50 text-indigo-600"
          badge="Proctored"
        />
      </div>

      {/* Main Content Split: Upcoming Exams + Performance & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scheduled Exams & Trend (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Upcoming Examinations Section */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Upcoming & Active Examinations
                </h2>
                <p className="text-xs text-slate-500">
                  Select an exam to review syllabus instructions and begin your attempt.
                </p>
              </div>
              <Link
                to="/student/exams"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View all ({exams.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {availableExams.slice(0, 4).map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>

          {/* Performance Trend Charts */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Historical Score Progression
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking your examination scores against class average benchmarks.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  Your Score
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  Cohort Benchmark
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.scoreTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="exam" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                <TrendingUp className="w-4 h-4" />
                Score velocity is trending +14.8% above departmental cohort.
              </span>
              <Link to="/student/performance" className="font-semibold text-indigo-600 hover:underline">
                Full Analytics &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard Snippet & Recent Attempts (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Leaderboard Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Cohort Leaderboard
                </h3>
              </div>
              <Link
                to="/student/leaderboard"
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                View Top 20 &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {leaderboard.slice(0, 5).map((entry) => {
                const isCurrent = entry.id === user?.id || entry.isCurrentUser;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      isCurrent
                        ? 'bg-indigo-50/80 border-indigo-200 ring-1 ring-indigo-400'
                        : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          entry.rank === 1
                            ? 'bg-amber-100 text-amber-800'
                            : entry.rank === 2
                            ? 'bg-slate-200 text-slate-700'
                            : entry.rank === 3
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {entry.rank}
                      </span>
                      <Avatar src={entry.avatar} name={entry.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {entry.name} {isCurrent && '(You)'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {entry.rollNo}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-900 block">
                        {entry.averageScore}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {entry.examsCompleted} exams
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Attempts Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Submissions
              </h3>
              <Link
                to="/student/attempts"
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                All Attempts &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {attempts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No recent attempts logged</p>
              ) : (
                attempts.slice(0, 3).map((att) => (
                  <Link
                    key={att.id}
                    to={`/student/results/${att.id}`}
                    className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {att.subjectCode}
                      </span>
                      <Badge variant={att.status === 'PASSED' ? 'success' : 'danger'} size="sm">
                        {att.percentage}%
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                      {att.examTitle}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{new Date(att.attemptDate).toLocaleDateString()}</span>
                      <span className="text-indigo-600 font-semibold group-hover:underline">
                        View Analysis &rarr;
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
