import React, { useState, useEffect } from 'react';
import { resultService } from '../../services/resultService';
import { examService } from '../../services/examService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Award,
  Search,
  Eye,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  BookOpen,
  Calendar
} from 'lucide-react';

export const ResultsManagement = () => {
  const [attempts, setAttempts] = useState([]);
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Attempt Inspection Modal
  const [inspectAttempt, setInspectAttempt] = useState(null);

  const fetchData = async () => {
    try {
      const [attData, exData] = await Promise.all([
        resultService.getAllAttempts(),
        examService.getExams()
      ]);
      setAttempts(attData);
      setExams(exData);
    } catch (err) {
      console.error('Failed to load results', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = attempts.filter((att) => {
    const matchesSearch =
      searchTerm === '' ||
      att.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (att.studentRoll && att.studentRoll.toLowerCase().includes(searchTerm.toLowerCase())) ||
      att.examTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExam = selectedExam === 'all' || att.examId === selectedExam;
    const matchesStatus = selectedStatus === 'all' || att.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesExam && matchesStatus;
  });

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Submission Evaluations & Results
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit student submissions, verify scoring keys, and inspect proctored logs.
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl">
          Total Graded: <span className="font-bold text-slate-900">{attempts.length}</span> attempts
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-6">
          <Input
            id="search-results"
            placeholder="Search candidate name, roll number, or assessment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            id="filter-res-exam"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            options={[
              { value: 'all', label: 'All Examinations' },
              ...exams.map(e => ({ value: e.id, label: e.title }))
            ]}
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            id="filter-res-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'passed', label: 'Passed Papers Only' },
              { value: 'failed', label: 'Failed Papers Only' }
            ]}
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton variant="row" count={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Award}
              title="No submission records match criteria"
              description="Adjust your search filters to view other candidate attempts."
              actionLabel="Reset Search"
              onAction={() => {
                setSearchTerm('');
                setSelectedExam('all');
                setSelectedStatus('all');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-6">Examination</th>
                  <th className="py-3.5 px-6">Score</th>
                  <th className="py-3.5 px-6">Percentage</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{att.studentName}</p>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {att.studentRoll || 'N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-900 line-clamp-1">{att.examTitle}</p>
                      <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded font-mono">
                        {att.subjectCode}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-900">
                      {att.score} / {att.totalMarks}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-black text-slate-900">{att.percentage}%</span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={att.status === 'PASSED' ? 'success' : 'danger'} size="sm" dot>
                        {att.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-500">
                      {formatDuration(att.durationSeconds || 900)}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-500">
                      {new Date(att.attemptDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInspectAttempt(att)}
                        leftIcon={Eye}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Attempt Modal */}
      {inspectAttempt && (
        <Modal
          isOpen={!!inspectAttempt}
          onClose={() => setInspectAttempt(null)}
          title="Submission Audit & Answer Sheet"
          subtitle={`Candidate: ${inspectAttempt.studentName} (${inspectAttempt.studentRoll}) &bull; Graded: ${inspectAttempt.percentage}%`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="p-1">
                <span className="font-black text-base text-slate-900 block">{inspectAttempt.score}/{inspectAttempt.totalMarks}</span>
                <span className="text-[10px] text-slate-500 uppercase">Marks</span>
              </div>
              <div className="p-1 border-l border-r border-slate-200">
                <span className={`font-black text-base block ${inspectAttempt.status === 'PASSED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {inspectAttempt.status}
                </span>
                <span className="text-[10px] text-slate-500 uppercase">Status</span>
              </div>
              <div className="p-1">
                <span className="font-black text-base text-slate-900 block">{formatDuration(inspectAttempt.durationSeconds || 900)}</span>
                <span className="text-[10px] text-slate-500 uppercase">Elapsed</span>
              </div>
            </div>

            {/* Answer item breakdown */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Question Responses:
              </h4>

              {inspectAttempt.questions && inspectAttempt.questions.length > 0 ? (
                inspectAttempt.questions.map((q, idx) => {
                  const resp = inspectAttempt.responses ? inspectAttempt.responses[q.id] : null;
                  const isCorrect = resp?.isCorrect;
                  const chosen = resp?.selected;

                  return (
                    <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Item #{idx + 1}</span>
                        <Badge variant={isCorrect ? 'success' : chosen ? 'danger' : 'neutral'} size="sm">
                          {isCorrect ? 'Correct (+2)' : chosen ? 'Incorrect (0)' : 'Unanswered (0)'}
                        </Badge>
                      </div>
                      <p className="text-slate-800 font-medium">{q.text}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-600 pt-1">
                        <span>Candidate Selected: <strong>Option {chosen || 'None'}</strong></span>
                        <span>Correct Answer: <strong className="text-emerald-700">Option {q.correctAnswer}</strong></span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  Detailed question key available for live attempt records.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setInspectAttempt(null)}>
                Close Audit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
