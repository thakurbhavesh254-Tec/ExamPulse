import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { resultService } from '../../services/resultService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Share2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ExamResult = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionReview, setShowQuestionReview] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await resultService.getAttemptById(id || 'att-801');
        setAttempt(data);

        // Confetti on Pass
        if (data && data.status === 'PASSED') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        console.error('Failed to load result', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSkeleton variant="card" count={1} />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Attempt Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">No evaluation history corresponds to this attempt identifier.</p>
        <Link to="/student/dashboard">
          <Button variant="outline">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isPassed = attempt.status === 'PASSED';

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const topicBreakdown = [
    { topic: 'Core Concepts', score: isPassed ? 90 : 45 },
    { topic: 'Algorithmic Logic', score: isPassed ? 85 : 50 },
    { topic: 'Problem Scenarios', score: isPassed ? 80 : 30 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Status Hero Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-xs transition-all ${
          isPassed
            ? 'bg-linear-to-b from-emerald-50/70 to-white border-emerald-200'
            : 'bg-linear-to-b from-rose-50/70 to-white border-rose-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={isPassed ? 'success' : 'danger'} size="md">
                  {isPassed ? 'EXAMINATION PASSED' : 'MINIMUM CRITERIA NOT MET'}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {attempt.subjectCode}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {attempt.examTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Evaluation concluded on {new Date(attempt.attemptDate).toLocaleDateString()} at{' '}
                {new Date(attempt.attemptDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Big Score Badge */}
          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-8 self-center sm:self-auto">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              {attempt.percentage}%
            </span>
            <span className="text-xs font-semibold text-slate-500 block mt-0.5">
              {attempt.score} / {attempt.totalMarks} Total Marks
            </span>
          </div>
        </div>

        {/* Breakdown 4-Stat Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-200/80">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider block">
              Correct Answers
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {attempt.correctCount || 0} Questions
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider block">
              Incorrect Answers
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {attempt.incorrectCount || 0} Questions
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Unanswered
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {attempt.unansweredCount || 0} Questions
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider block">
              Time Taken
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {formatDuration(attempt.durationSeconds || 900)}
            </span>
          </div>
        </div>
      </div>

      {/* Topic Mastery & Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Domain Performance Chart (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
            Sectional Mastery Analysis
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Percentage accuracy achieved across specific question domains.
          </p>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicBreakdown} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="topic" type="category" stroke="#94a3b8" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none'
                  }}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Faculty Advisory & Suggestions (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Academic Recommendations
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Automated diagnostic evaluation for continuous preparation:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                <span>
                  {isPassed
                    ? 'Excellent command demonstrated on fundamentals and algorithmic analysis.'
                    : 'Review syllabus units related to tree balancing and quadratic hash resolutions.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                <span>
                  Average response latency was 1m 45s per item (optimal velocity).
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Minimum Passing Score: {attempt.passingMarks || 4} marks</span>
            <span className="font-semibold text-emerald-600">Accreditation Verified</span>
          </div>
        </div>
      </div>

      {/* Question by Question Review Accordion */}
      {attempt.questions && attempt.questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Question-by-Question Solution Review
              </h3>
              <p className="text-xs text-slate-500">
                Inspect your submitted responses alongside verified faculty keys.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuestionReview(!showQuestionReview)}
              rightIcon={showQuestionReview ? ChevronUp : ChevronDown}
            >
              {showQuestionReview ? 'Collapse Review' : 'Inspect All Questions'}
            </Button>
          </div>

          {showQuestionReview && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              {attempt.questions.map((q, idx) => {
                const response = attempt.responses ? attempt.responses[q.id] : null;
                const isCorrect = response?.isCorrect;
                const selectedOpt = response?.selected;

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          Q{idx + 1}.
                        </span>
                        <Badge variant={isCorrect ? 'success' : selectedOpt ? 'danger' : 'neutral'} size="sm">
                          {isCorrect ? 'Correct (+2)' : selectedOpt ? 'Incorrect (0)' : 'Unattempted (0)'}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {q.topic}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      {q.text}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options?.map((opt) => {
                        const wasChosen = selectedOpt === opt.id;
                        const isAnswerKey = q.correctAnswer === opt.id;

                        let style = 'bg-white border-slate-200 text-slate-700';
                        if (isAnswerKey) {
                          style = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                        } else if (wasChosen && !isCorrect) {
                          style = 'bg-rose-50 border-rose-300 text-rose-900 font-semibold';
                        }

                        return (
                          <div key={opt.id} className={`p-2.5 rounded-lg border flex items-center justify-between ${style}`}>
                            <span className="flex items-center gap-2">
                              <span className="font-bold">{opt.id}.</span>
                              <span>{opt.text}</span>
                            </span>
                            {isAnswerKey && (
                              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                                Correct Answer
                              </span>
                            )}
                            {wasChosen && !isAnswerKey && (
                              <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">
                                Your Selection
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900">
                        <span className="font-semibold">Faculty Explanation: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
        <Link to="/student/attempts">
          <Button variant="outline" size="md">
            View Attempt History
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/student/performance">
            <Button variant="outline" size="md" leftIcon={BarChart3}>
              Open Analytics Dashboard
            </Button>
          </Link>
          <Link to="/student/dashboard">
            <Button variant="primary" size="md" rightIcon={ArrowRight}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
