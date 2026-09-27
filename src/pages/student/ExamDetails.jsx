import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { examService } from '../../services/examService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Clock,
  HelpCircle,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  ArrowLeft
} from 'lucide-react';

export const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await examService.getExamById(id || 'exam-1');
        setExam(data);
      } catch (err) {
        console.error('Failed to load exam details', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSkeleton variant="card" count={1} />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Examination Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">The specified examination is either unpublished or archived.</p>
        <Link to="/student/exams">
          <Button variant="outline">Back to Exam Catalog</Button>
        </Link>
      </div>
    );
  }

  const handleLaunchExam = () => {
    setShowConfirmModal(false);
    navigate(`/student/exams/${exam.id}/attempt`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/student/exams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="neutral" size="sm" className="font-mono">
            {exam.code}
          </Badge>
          <Badge variant="brand" size="sm">
            {exam.subjectCode} - {exam.subjectName}
          </Badge>
          <Badge
            variant={
              exam.difficulty === 'Hard' ? 'danger' : exam.difficulty === 'Medium' ? 'warning' : 'success'
            }
            size="sm"
            dot
          >
            {exam.difficulty} Level
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
          {exam.title}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {exam.description}
        </p>

        {/* Key Metrics 4-Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Time Allowed
            </span>
            <span className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              {exam.durationMinutes} Mins
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Questions
            </span>
            <span className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              {exam.totalQuestions} Questions
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Max Score
            </span>
            <span className="text-lg font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-indigo-600" />
              {exam.totalMarks} Marks
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Pass Criterion
            </span>
            <span className="text-lg font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              {exam.passingMarks} Marks
            </span>
          </div>
        </div>
      </div>

      {/* Rules and Guidelines */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Important Instructions & Proctoring Protocol
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Please read these requirements carefully before initiating your assessment.
          </p>
        </div>

        <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
          {(exam.instructions || [
            "Ensure an uninterrupted high-speed internet connection.",
            "Navigating away from the active browser window will trigger warning logs.",
            "The timer starts immediately upon clicking 'Start Examination'.",
            "Responses are saved continuously in real-time.",
            "The test will automatically submit when the countdown reaches 00:00:00."
          ]).map((inst, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{inst}</span>
            </li>
          ))}
        </ul>

        {/* Proctoring notice box */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Security Proctor Active</p>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              Window resizing, right-clicks, copy-paste shortcuts, and alt-tab switching are monitored. 
              Submitting fraudulent attempts will result in disciplinary committee reporting.
            </p>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
            />
            <span>
              I have read and agree to abide by all the examination guidelines, academic integrity codes, and proctoring policies.
            </span>
          </label>
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            System ready: Chrome/Edge Browser Compatible &bull; Fullscreen enforced
          </span>

          <Button
            size="lg"
            variant="primary"
            disabled={!agreedTerms}
            onClick={() => setShowConfirmModal(true)}
            rightIcon={ArrowRight}
          >
            Start Examination Now
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleLaunchExam}
        title="Ready to Begin Examination?"
        message={`You are about to launch "${exam.title}". The countdown timer of ${exam.durationMinutes} minutes will commence immediately. Please ensure your environment is quiet and free of distractions.`}
        confirmText="Yes, Begin Exam"
        cancelText="Cancel"
        variant="info"
      />
    </div>
  );
};
