import React, { useState, useEffect } from 'react';
import { questionService } from '../../services/questionService';
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
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const QuestionBank = () => {
  const toast = useToast();
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Question Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  const [formData, setFormData] = useState({
    subjectId: '',
    text: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: 2,
    difficulty: 'Medium',
    topic: '',
    explanation: ''
  });

  // Preview Modal
  const [previewQuestion, setPreviewQuestion] = useState(null);

  // Delete Confirm Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [qData, subData] = await Promise.all([
        questionService.getQuestions(),
        subjectService.getSubjects()
      ]);
      setQuestions(qData);
      setSubjects(subData);
      if (subData.length > 0 && !formData.subjectId) {
        setFormData(prev => ({ ...prev, subjectId: subData[0].id }));
      }
    } catch (err) {
      toast.error('Failed to load question repository');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setActiveQuestionId(null);
    setFormData({
      subjectId: subjects[0]?.id || 'sub-1',
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: 2,
      difficulty: 'Medium',
      topic: '',
      explanation: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setModalMode('edit');
    setActiveQuestionId(q.id);
    const optMap = {};
    (q.options || []).forEach(o => {
      optMap[o.id] = o.text;
    });

    setFormData({
      subjectId: q.subjectId || subjects[0]?.id,
      text: q.text,
      optionA: optMap['A'] || '',
      optionB: optMap['B'] || '',
      optionC: optMap['C'] || '',
      optionD: optMap['D'] || '',
      correctAnswer: q.correctAnswer || 'A',
      marks: q.marks || 2,
      difficulty: q.difficulty || 'Medium',
      topic: q.topic || '',
      explanation: q.explanation || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      toast.error('Question text is required');
      return;
    }
    if (!formData.optionA || !formData.optionB) {
      toast.error('At least Option A and Option B must be populated');
      return;
    }

    const payload = {
      subjectId: formData.subjectId,
      text: formData.text,
      options: [
        { id: 'A', text: formData.optionA },
        { id: 'B', text: formData.optionB },
        { id: 'C', text: formData.optionC },
        { id: 'D', text: formData.optionD }
      ].filter(o => o.text.trim().length > 0),
      correctAnswer: formData.correctAnswer,
      marks: Number(formData.marks || 2),
      difficulty: formData.difficulty,
      topic: formData.topic || 'Core Curriculum',
      explanation: formData.explanation
    };

    try {
      if (modalMode === 'add') {
        await questionService.createQuestion(payload);
        toast.success('Question added to repository');
      } else {
        await questionService.updateQuestion(activeQuestionId, payload);
        toast.success('Question updated successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    try {
      await questionService.deleteQuestion(questionToDelete.id);
      toast.success('Question removed from bank');
      setIsDeleteDialogOpen(false);
      setQuestionToDelete(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete question');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      searchTerm === '' ||
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.topic && q.topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || q.subjectId === selectedSubject;
    const matchesDifficulty =
      selectedDifficulty === 'all' || q.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Institutional Question Bank
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Curate multiple choice items, solution keys, difficulty tiers, and topic tags.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} leftIcon={Plus}>
          Add New Question
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-6">
          <Input
            id="search-questions"
            placeholder="Search questions by problem statement or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            id="filter-q-subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={[
              { value: 'all', label: 'All Subjects' },
              ...subjects.map(s => ({ value: s.id, label: s.name }))
            ]}
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            id="filter-q-diff"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            options={[
              { value: 'all', label: 'All Difficulties' },
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' }
            ]}
          />
        </div>
      </div>

      {/* Question Cards Grid / List */}
      {isLoading ? (
        <div className="p-6">
          <LoadingSkeleton variant="row" count={5} />
        </div>
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No questions in repository"
          description="Create your first question item or expand your search filters."
          actionLabel="Add Question"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    Item #{idx + 1}
                  </span>
                  <Badge
                    variant={
                      q.difficulty === 'Hard' ? 'danger' : q.difficulty === 'Medium' ? 'brand' : 'success'
                    }
                    size="sm"
                    dot
                  >
                    {q.difficulty}
                  </Badge>
                  {q.topic && (
                    <span className="text-xs text-slate-500 font-medium">
                      &bull; {q.topic}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    +{q.marks || 2} Marks
                  </span>
                  <button
                    onClick={() => setPreviewQuestion(q)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Preview Question"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Question"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setQuestionToDelete(q);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {q.text}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options?.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2 rounded-lg border flex items-center justify-between ${
                      opt.id === q.correctAnswer
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-bold">{opt.id}.</span>
                      <span>{opt.text}</span>
                    </span>
                    {opt.id === q.correctAnswer && (
                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                        Answer Key
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {q.explanation && (
                <p className="text-xs text-slate-500 pt-1 border-t border-slate-100 italic">
                  <strong>Solution Note:</strong> {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Create Examination Question' : 'Modify Question Item'}
        subtitle="Specify MCQ statement, 4 choices, verified answer key, and marks."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Subject Assignment"
              id="q-sub"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              options={subjects.map(s => ({ value: s.id, label: s.name }))}
              required
            />
            <Select
              label="Difficulty Tier"
              id="q-diff"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              options={[
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' }
              ]}
            />
            <Input
              label="Marks Allocated"
              id="q-marks"
              type="number"
              min="1"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
              required
            />
          </div>

          <Input
            label="Topic / Sub-Domain Tag"
            id="q-topic"
            placeholder="e.g. Balanced Trees, Normalization, Deadlocks..."
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Question Statement *</label>
            <textarea
              rows={3}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Enter complete question statement, problem premise, or pseudocode snippet..."
              className="text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600 transition-colors"
              required
            />
          </div>

          {/* 4 MCQ Options */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Multiple Choice Options</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Option A"
                id="opt-a"
                placeholder="Option text A"
                value={formData.optionA}
                onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                required
              />
              <Input
                label="Option B"
                id="opt-b"
                placeholder="Option text B"
                value={formData.optionB}
                onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                required
              />
              <Input
                label="Option C"
                id="opt-c"
                placeholder="Option text C"
                value={formData.optionC}
                onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
              />
              <Input
                label="Option D"
                id="opt-d"
                placeholder="Option text D"
                value={formData.optionD}
                onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
              />
            </div>
          </div>

          {/* Correct Answer Key Selector */}
          <Select
            label="Official Correct Answer Key"
            id="correct-key"
            value={formData.correctAnswer}
            onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
            options={[
              { value: 'A', label: 'Option A is Correct' },
              { value: 'B', label: 'Option B is Correct' },
              { value: 'C', label: 'Option C is Correct' },
              { value: 'D', label: 'Option D is Correct' }
            ]}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Faculty Solution & Explanation Key</label>
            <textarea
              rows={2}
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Explain why the selected option is correct for student feedback report..."
              className="text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600 transition-colors"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {modalMode === 'add' ? 'Save to Bank' : 'Update Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewQuestion && (
        <Modal
          isOpen={!!previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          title="Student Live Preview"
          subtitle="How this question renders on candidate examination screens."
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <Badge variant="brand" size="sm">
                {previewQuestion.difficulty}
              </Badge>
              <span className="text-xs font-bold text-slate-900">
                +{previewQuestion.marks} Marks
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {previewQuestion.text}
            </p>

            <div className="space-y-2">
              {previewQuestion.options?.map((opt) => (
                <div
                  key={opt.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3 text-xs text-slate-800"
                >
                  <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-bold">
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setPreviewQuestion(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Question Item?"
        message="Are you sure you want to permanently delete this item from the university question bank? This cannot be undone."
        confirmText="Confirm Delete"
        variant="danger"
      />
    </div>
  );
};
