import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import { questionService } from '../../services/questionService';
import { resultService } from '../../services/resultService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Clock,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Award
} from 'lucide-react';

export const LiveExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [markedForReview, setMarkedForReview] = useState({}); // { [questionId]: boolean }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(2700); // 45m default
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);

  const initialDurationRef = useRef(2700);

  // Load Exam and Questions
  useEffect(() => {
    const initExam = async () => {
      try {
        const [examData, qData] = await Promise.all([
          examService.getExamById(id || 'exam-1'),
          questionService.getExamQuestions(id || 'exam-1')
        ]);
        setExam(examData);
        setQuestions(qData);
        const durationSec = (examData?.durationMinutes || 45) * 60;
        setTimeLeftSeconds(durationSec);
        initialDurationRef.current = durationSec;
      } catch (err) {
        console.error('Failed to initialize exam', err);
        toast.error('Failed to load examination questions');
      } finally {
        setIsLoading(false);
      }
    };
    initExam();
  }, [id]);

  // Window BeforeUnload Protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'You have an active examination in progress. Leaving will forfeit your responses.';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Proctor Tab Switch Warning
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitting) {
        setTabSwitchWarnings((prev) => {
          const next = prev + 1;
          toast.warning(`Security Alert: Focus lost! Tab switch count: ${next}. This incident has been logged.`, 'Proctor Warning');
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSubmitting]);

  // Handle Submission Logic
  const handleFinalSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowSubmitModal(false);

    try {
      const elapsedSeconds = initialDurationRef.current - timeLeftSeconds;
      const result = await resultService.submitExam({
        examId: exam?.id || id,
        student: user,
        answers,
        durationSeconds: elapsedSeconds > 0 ? elapsedSeconds : 60
      });

      toast.success('Exam submitted successfully! Generating evaluation report...');
      navigate(`/student/results/${result.id}`, { replace: true });
    } catch (err) {
      console.error('Submission failed', err);
      toast.error('Failed to submit exam. Please try again.');
      setIsSubmitting(false);
    }
  }, [isSubmitting, exam, id, user, answers, timeLeftSeconds, navigate, toast]);

  // Countdown Timer
  useEffect(() => {
    if (isLoading || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.warning('Time expired! Automatically submitting examination.');
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, isSubmitting, handleFinalSubmit, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium">Securing proctored test environment...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];
  const selectedOption = currentQ ? answers[currentQ.id] : null;
  const isCurrentMarked = currentQ ? !!markedForReview[currentQ.id] : false;

  // Formatting Timer
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeftSeconds < 300; // < 5 mins

  // Question navigation actions
  const handleSelectOption = (optionId) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleClearAnswer = () => {
    if (!currentQ) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
  };

  const handleToggleMarkReview = () => {
    if (!currentQ) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleSaveAndNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Stats for palette
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* Top Fixed Examination Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Exam info */}
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-semibold px-2 py-0.5 rounded">
              {exam?.subjectCode || 'EXAM'}
            </span>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-white tracking-tight truncate max-w-md">
                {exam?.title}
              </h1>
              <span className="text-[10px] text-slate-400">
                Candidate: {user?.name} ({user?.rollNo})
              </span>
            </div>
          </div>

          {/* Center / Right: Countdown Timer and Submit */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Timer Box */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-mono font-bold transition-colors ${
                isLowTime
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-indigo-300'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0 text-slate-400" />
              <span>{formatTime(timeLeftSeconds)}</span>
              {isLowTime && (
                <span className="text-[10px] uppercase font-sans text-rose-400 hidden sm:inline">
                  Low Time
                </span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 font-semibold"
              rightIcon={Send}
            >
              Finish & Submit
            </Button>
          </div>
        </div>
      </header>

      {/* Proctor Security Status Sub-banner */}
      {tabSwitchWarnings > 0 && (
        <div className="bg-amber-500 text-slate-950 text-xs px-4 py-1.5 font-semibold text-center flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Notice: Proctor logged {tabSwitchWarnings} out-of-focus event(s). Maintain active browser window.</span>
        </div>
      )}

      {/* Main Examination Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-16">
        {/* Left / Center Area: Question & MCQ Radio Options (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Question Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            {/* Question Meta Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <Badge variant={currentQ?.difficulty === 'Hard' ? 'danger' : 'brand'} size="sm">
                  {currentQ?.difficulty || 'Medium'}
                </Badge>
                {currentQ?.topic && (
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                    &bull; {currentQ.topic}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>+{currentQ?.marks || 2} Marks</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                {currentQ?.text}
              </h2>
            </div>

            {/* MCQ Options List */}
            <div className="space-y-3">
              {currentQ?.options?.map((option) => {
                const isSelected = selectedOption === option.id;
                return (
                  <label
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer select-none ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs transition-colors ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 text-slate-500 bg-white'
                      }`}
                    >
                      {option.id}
                    </div>

                    <span className="text-sm text-slate-800 leading-relaxed flex-1">
                      {option.text}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Bottom Actions Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAnswer}
                  disabled={!selectedOption}
                  leftIcon={RotateCcw}
                >
                  Clear Selection
                </Button>
                <Button
                  variant={isCurrentMarked ? 'warning' : 'outline'}
                  size="sm"
                  onClick={handleToggleMarkReview}
                  leftIcon={Bookmark}
                  className={isCurrentMarked ? 'bg-amber-500 text-white border-amber-600' : ''}
                >
                  {isCurrentMarked ? 'Marked for Review' : 'Mark for Review'}
                </Button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  leftIcon={ChevronLeft}
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveAndNext}
                  disabled={currentIndex === questions.length - 1}
                  rightIcon={ChevronRight}
                >
                  Save & Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Question Palette (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
              Question Palette
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-500" />
                <span>Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-200" />
                <span>Not Answered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded ring-2 ring-indigo-600 bg-white" />
                <span>Active Question</span>
              </div>
            </div>

            {/* Palette Buttons Grid */}
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((q, idx) => {
                const isAns = !!answers[q.id];
                const isMarked = !!markedForReview[q.id];
                const isCur = idx === currentIndex;

                let colorStyles = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                if (isAns && isMarked) {
                  colorStyles = 'bg-amber-500 text-white hover:bg-amber-600 border-amber-600 font-bold';
                } else if (isAns) {
                  colorStyles = 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 font-bold';
                } else if (isMarked) {
                  colorStyles = 'bg-amber-500 text-white hover:bg-amber-600 border-amber-600 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-xl text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${colorStyles} ${
                      isCur ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Palette Progress Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Completion Status</span>
                <span className="font-bold text-slate-900">
                  {Math.round((answeredCount / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Submission Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Examination?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Please verify your attempt summary before concluding your session. 
            Once submitted, your responses are final and cannot be modified.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="p-2">
              <span className="text-lg font-bold text-emerald-600 block">{answeredCount}</span>
              <span className="text-[10px] text-slate-500 uppercase font-medium">Answered</span>
            </div>
            <div className="p-2 border-l border-r border-slate-200">
              <span className="text-lg font-bold text-amber-600 block">{markedCount}</span>
              <span className="text-[10px] text-slate-500 uppercase font-medium">Marked</span>
            </div>
            <div className="p-2">
              <span className="text-lg font-bold text-rose-600 block">{unansweredCount}</span>
              <span className="text-[10px] text-slate-500 uppercase font-medium">Unanswered</span>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>You have {unansweredCount} unanswered questions remaining.</span>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setShowSubmitModal(false)}>
              Continue Answering
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleFinalSubmit}
              isLoading={isSubmitting}
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
