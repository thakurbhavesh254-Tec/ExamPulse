import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { resultService } from '../../services/resultService';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Users,
  Search,
  Eye,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Mail,
  CheckCircle2
} from 'lucide-react';

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Student Profile Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAttempts, setStudentAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  const fetchStudents = async () => {
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load student registry', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInspectStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingAttempts(true);
    try {
      const attempts = await resultService.getStudentAttempts(student.id);
      setStudentAttempts(attempts);
    } catch (err) {
      console.error('Failed to load student attempts', err);
    } finally {
      setLoadingAttempts(false);
    }
  };

  const filtered = students.filter((s) => {
    const matchesSearch =
      searchTerm === '' ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'all' || s.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Enrolled Student Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit registered candidates, department allocations, and exam clearance standings.
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl">
          Active Roster: <span className="font-bold text-slate-900">{students.length}</span> students
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8">
          <Input
            id="search-students-input"
            placeholder="Search by candidate name, roll number, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="sm:col-span-4">
          <Select
            id="filter-students-dept"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            options={[
              { value: 'all', label: 'All Departments' },
              { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering' },
              { value: 'Information Technology', label: 'Information Technology' },
              { value: 'Data Science & AI', label: 'Data Science & AI' }
            ]}
          />
        </div>
      </div>

      {/* Student Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton variant="row" count={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="No students found"
              description="No candidates match your current search criteria."
              actionLabel="Clear Filter"
              onAction={() => {
                setSearchTerm('');
                setSelectedDept('all');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-6">Roll Number</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Semester</th>
                  <th className="py-3.5 px-6">Evaluations</th>
                  <th className="py-3.5 px-6">Average Score</th>
                  <th className="py-3.5 px-6">Standing</th>
                  <th className="py-3.5 px-6 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} size="sm" />
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {student.rollNo}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-700">
                      {student.department}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                      {student.semester}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-900">
                      {student.attemptsCount} tests
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-black text-slate-900">{student.avgScore}%</span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={student.status === 'Active' ? 'success' : 'warning'} size="sm" dot>
                        {student.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInspectStudent(student)}
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

      {/* Student Profile & Attempt History Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title="Student Candidate Profile"
          subtitle={`Roll No: ${selectedStudent.rollNo} &bull; ${selectedStudent.department}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            {/* Student Info Card */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <Avatar name={selectedStudent.name} size="lg" />
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span>Semester: <strong>{selectedStudent.semester}</strong></span>
                  <span>Avg Score: <strong className="text-emerald-600">{selectedStudent.avgScore}%</strong></span>
                  <span>Evaluations: <strong>{selectedStudent.attemptsCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Past Attempts Table for this Student */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Recent Examination Submissions
              </h4>

              {loadingAttempts ? (
                <div className="p-4">
                  <LoadingSkeleton variant="row" count={2} />
                </div>
              ) : studentAttempts.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  No graded attempts recorded for this candidate yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {studentAttempts.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{att.examTitle}</p>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {att.subjectCode} &bull; {new Date(att.attemptDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900">{att.percentage}%</span>
                        <Badge variant={att.status === 'PASSED' ? 'success' : 'danger'} size="sm">
                          {att.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                Close Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
