import React, { useState, useEffect } from 'react';
import { examService } from '../../services/examService';
import { subjectService } from '../../services/subjectService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Edit2,
  Copy,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const ExamManagement = () => {
  const toast = useToast();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Multi-step Builder Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [activeStep, setActiveStep] = useState(1);
  const [activeExamId, setActiveExamId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    subjectName: '',
    subjectCode: '',
    description: '',
    durationMinutes: 45,
    totalQuestions: 5,
    totalMarks: 10,
    passingMarks: 5,
    difficulty: 'Medium',
    status: 'Published',
    attemptsAllowed: 1
  });

  // Delete Confirm Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [examsData, subsData] = await Promise.all([
        examService.getExams(),
        subjectService.getSubjects()
      ]);
      setExams(examsData);
      setSubjects(subsData);
      if (subsData.length > 0 && !formData.subjectId) {
        setFormData(prev => ({
          ...prev,
          subjectId: subsData[0].id,
          subjectName: subsData[0].name,
          subjectCode: subsData[0].code
        }));
      }
    } catch (err) {
      toast.error('Failed to load examination schedule');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setActiveExamId(null);
    setActiveStep(1);
    const firstSub = subjects[0] || {};
    setFormData({
      title: '',
      subjectId: firstSub.id || 'sub-1',
      subjectName: firstSub.name || 'Data Structures',
      subjectCode: firstSub.code || 'CS301',
      description: '',
      durationMinutes: 45,
      totalQuestions: 5,
      totalMarks: 10,
      passingMarks: 5,
      difficulty: 'Medium',
      status: 'Published',
      attemptsAllowed: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exam) => {
    setModalMode('edit');
    setActiveExamId(exam.id);
    setActiveStep(1);
    setFormData({
      title: exam.title,
      subjectId: exam.subjectId,
      subjectName: exam.subjectName,
      subjectCode: exam.subjectCode,
      description: exam.description,
      durationMinutes: exam.durationMinutes,
      totalQuestions: exam.totalQuestions,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      difficulty: exam.difficulty,
      status: exam.status,
      attemptsAllowed: exam.attemptsAllowed || 1
    });
    setIsModalOpen(true);
  };

  const handleSubjectChange = (subId) => {
    const sub = subjects.find(s => s.id === subId);
    if (sub) {
      setFormData(prev => ({
        ...prev,
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code
      }));
    }
  };

  const handleSaveExam = async () => {
    if (!formData.title.trim()) {
      toast.error('Examination Title is required');
      return;
    }

    try {
      if (modalMode === 'add') {
        await examService.createExam(formData);
        toast.success(`Exam "${formData.title}" published successfully`);
      } else {
        await examService.updateExam(activeExamId, formData);
        toast.success(`Exam "${formData.title}" updated successfully`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDuplicate = async (exam) => {
    try {
      const dup = await examService.duplicateExam(exam.id);
      toast.success(`Exam duplicated as "${dup.title}"`);
      fetchData();
    } catch (err) {
      toast.error('Failed to duplicate exam');
    }
  };

  const handleTogglePublish = async (exam) => {
    try {
      const updated = await examService.togglePublish(exam.id);
      toast.info(`Status changed to ${updated.status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update publish state');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!examToDelete) return;
    setIsDeleting(true);
    try {
      await examService.deleteExam(examToDelete.id);
      toast.success(`Exam deleted successfully`);
      setIsDeleteDialogOpen(false);
      setExamToDelete(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete exam');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredExams = exams.filter(e => {
    const matchesSearch =
      searchTerm === '' ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || e.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Examination Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, configure, schedule, and moderate university assessments.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} leftIcon={Plus}>
          Create Examination
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-8">
          <Input
            id="search-exam-manage"
            placeholder="Search by assessment title, course code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="sm:col-span-4">
          <Select
            id="filter-exam-sub"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={[
              { value: 'all', label: 'All Subjects' },
              ...subjects.map(s => ({ value: s.id, label: s.name }))
            ]}
          />
        </div>
      </div>

      {/* Exams Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton variant="row" count={4} />
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FileSpreadsheet}
              title="No examinations configured"
              description="Create an evaluation template using the multi-step builder."
              actionLabel="Create Exam"
              onAction={handleOpenAdd}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Examination</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6">Questions</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Marks (Pass)</th>
                  <th className="py-3.5 px-6">Difficulty</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {exam.code}
                        </span>
                        <span className="font-bold text-slate-900 line-clamp-1">
                          {exam.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {exam.description}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-700 font-medium">
                      {exam.subjectName}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap font-semibold text-slate-900">
                      {exam.totalQuestions} Items
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                      {exam.durationMinutes} Mins
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{exam.totalMarks}</span>
                      <span className="text-slate-400 text-[11px]"> (Pass: {exam.passingMarks})</span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge
                        variant={
                          exam.difficulty === 'Hard' ? 'danger' : exam.difficulty === 'Medium' ? 'brand' : 'success'
                        }
                        size="sm"
                      >
                        {exam.difficulty}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(exam)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <Badge variant={exam.status === 'Published' ? 'success' : 'neutral'} size="sm" dot>
                          {exam.status}
                        </Badge>
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(exam)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Exam"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(exam)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Duplicate Exam"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setExamToDelete(exam);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Exam"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Multi-Step Exam Builder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Multi-Step Exam Builder' : 'Modify Assessment Parameters'}
        subtitle={`Step ${activeStep} of 3 &bull; ${
          activeStep === 1 ? 'Course & Title' : activeStep === 2 ? 'Duration & Grading' : 'Final Review'
        }`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-5">
          {/* Step indicator pills */}
          <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-100 rounded-xl text-xs font-semibold">
            <span
              className={`flex-1 py-1.5 text-center rounded-lg transition-colors ${
                activeStep === 1 ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              1. Basic Info
            </span>
            <span
              className={`flex-1 py-1.5 text-center rounded-lg transition-colors ${
                activeStep === 2 ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              2. Timing & Rules
            </span>
            <span
              className={`flex-1 py-1.5 text-center rounded-lg transition-colors ${
                activeStep === 3 ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'
              }`}
            >
              3. Review & Save
            </span>
          </div>

          {/* STEP 1: Basic Information */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <Select
                label="Academic Subject"
                id="exam-sub-select"
                value={formData.subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                options={subjects.map(s => ({ value: s.id, label: `${s.code} - ${s.name}` }))}
                required
              />

              <Input
                label="Examination Title"
                id="exam-title-input"
                placeholder="e.g. Mid-Term Examination: Operating System Semaphores"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Course Syllabus Scope & Overview</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail modules covered, e.g. Process Scheduling, Paging, Virtual Memory..."
                  className="text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Timing, Marks, Difficulty */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Duration (Minutes)"
                  id="exam-duration"
                  type="number"
                  min="5"
                  max="180"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                  required
                />

                <Input
                  label="Number of Questions"
                  id="exam-questions-count"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.totalQuestions}
                  onChange={(e) => setFormData({ ...formData, totalQuestions: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Total Marks"
                  id="exam-marks"
                  type="number"
                  min="1"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
                  required
                />

                <Input
                  label="Passing Minimum"
                  id="exam-pass-marks"
                  type="number"
                  min="1"
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Difficulty Rating"
                  id="exam-diff"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  options={[
                    { value: 'Easy', label: 'Easy (Introductory)' },
                    { value: 'Medium', label: 'Medium (Standard University)' },
                    { value: 'Hard', label: 'Hard (Advanced Honors)' }
                  ]}
                />

                <Select
                  label="Allowed Attempts"
                  id="exam-attempts-allowed"
                  value={formData.attemptsAllowed}
                  onChange={(e) => setFormData({ ...formData, attemptsAllowed: Number(e.target.value) })}
                  options={[
                    { value: 1, label: 'Single Attempt Only' },
                    { value: 2, label: '2 Attempts Allowed' },
                    { value: 3, label: '3 Attempts Allowed' }
                  ]}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Review & Summary */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-900 text-sm">{formData.title || 'Untitled Assessment'}</p>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold">
                    {formData.subjectCode}
                  </span>
                  <span>{formData.subjectName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-700">
                  <div><strong>Duration:</strong> {formData.durationMinutes} mins</div>
                  <div><strong>Total Marks:</strong> {formData.totalMarks} marks</div>
                  <div><strong>Questions:</strong> {formData.totalQuestions} items</div>
                  <div><strong>Passing Score:</strong> {formData.passingMarks} marks</div>
                  <div><strong>Difficulty:</strong> {formData.difficulty}</div>
                  <div><strong>Max Attempts:</strong> {formData.attemptsAllowed}</div>
                </div>
              </div>

              <Select
                label="Publication Status"
                id="exam-pub-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'Published', label: 'Published (Visible to students immediately)' },
                  { value: 'Draft', label: 'Draft (Save internally for faculty review)' }
                ]}
              />
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {activeStep > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveStep(activeStep - 1)}
                leftIcon={ChevronLeft}
              >
                Back
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            )}

            {activeStep < 3 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveStep(activeStep + 1)}
                rightIcon={ChevronRight}
              >
                Next Step
              </Button>
            ) : (
              <Button variant="success" size="sm" onClick={handleSaveExam}>
                {modalMode === 'add' ? 'Publish Examination' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Examination Template?"
        message={`Are you sure you want to permanently delete "${examToDelete?.title}"? All existing student attempt records for this exam will be removed.`}
        confirmText="Confirm Delete"
        variant="danger"
      />
    </div>
  );
};
