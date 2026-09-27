import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Clock, HelpCircle, Award, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ExamCard = ({ exam, onStart, hasAttempted = false }) => {
  const difficultyVariants = {
    Easy: 'success',
    Medium: 'brand',
    Hard: 'danger'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="neutral" size="sm" className="font-mono">
            {exam.subjectCode || 'CORE'}
          </Badge>
          <Badge variant={difficultyVariants[exam.difficulty] || 'neutral'} size="sm" dot>
            {exam.difficulty}
          </Badge>
        </div>

        {/* Subject & Title */}
        <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
          {exam.subjectName}
        </span>
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug mb-2 line-clamp-2">
          {exam.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {exam.description}
        </p>

        {/* Meta details grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-t border-b border-slate-100 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{exam.durationMinutes} Minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{exam.totalQuestions} Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{exam.totalMarks} Marks (Pass: {exam.passingMarks})</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{exam.attemptsAllowed ? `${exam.attemptsAllowed} Attempts Max` : 'Single Attempt'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2.5 pt-1">
        <Link to={`/student/exams/${exam.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Syllabus
          </Button>
        </Link>
        <Link to={`/student/exams/${exam.id}/instructions`} className="flex-1">
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            rightIcon={ArrowRight}
          >
            Start Exam
          </Button>
        </Link>
      </div>
    </div>
  );
};
