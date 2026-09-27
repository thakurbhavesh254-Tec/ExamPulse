import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resultService } from '../../services/resultService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Search, BookOpen, Clock, Award, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export const AttemptHistory = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 5;

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const studentId = user?.id || user?.studentId;
        const data = await resultService.getStudentAttempts(studentId);
        setAttempts(data);
      } catch (err) {
        console.error('Failed to load attempt history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttempts();
  }, [user]);

  const filtered = attempts.filter((att) => {
    const matchesSearch =
      searchTerm === '' ||
      att.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.subjectName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || att.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedAttempts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Examination Attempt History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit log of all your graded submissions, evaluations, and proctored attempts.
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl self-start md:self-center">
          Total Attempts Logged: <span className="font-bold text-slate-900">{attempts.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8">
          <Input
            id="search-attempts"
            placeholder="Search past attempts by examination name, subject code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="sm:col-span-4">
          <Select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Submission Statuses' },
              { value: 'passed', label: 'Passed Papers Only' },
              { value: 'failed', label: 'Failed Papers Only' }
            ]}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton variant="row" count={4} />
          </div>
        ) : paginatedAttempts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={BookOpen}
              title="No attempts found"
              description="No completed evaluations match your current filter parameters."
              actionLabel="Reset Search"
              onAction={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Examination & Course</th>
                  <th className="py-3.5 px-6">Date Attempted</th>
                  <th className="py-3.5 px-6">Score & Marks</th>
                  <th className="py-3.5 px-6">Percentage</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {att.subjectCode}
                        </span>
                        <span className="font-bold text-slate-900 line-clamp-1">
                          {att.examTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {att.subjectName}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                      {new Date(att.attemptDate).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                      {att.score} / {att.totalMarks}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-extrabold text-slate-900">
                        {att.percentage}%
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={att.status === 'PASSED' ? 'success' : 'danger'} size="sm" dot>
                        {att.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-500">
                      {formatDuration(att.durationSeconds || 900)}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Link to={`/student/results/${att.id}`}>
                        <Button variant="outline" size="sm" rightIcon={ChevronRight}>
                          View Analysis
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
