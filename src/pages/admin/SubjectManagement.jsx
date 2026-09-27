import React, { useState, useEffect } from 'react';
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
  FolderKanban,
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

export const SubjectManagement = () => {
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [activeSubject, setActiveSubject] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'Computer Science & Engineering',
    description: '',
    status: 'Active'
  });

  // Delete Confirm Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getSubjects();
      setSubjects(data);
    } catch (err) {
      toast.error('Failed to load subjects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setActiveSubject(null);
    setFormData({
      code: '',
      name: '',
      department: 'Computer Science & Engineering',
      description: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setModalMode('edit');
    setActiveSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      department: subject.department,
      description: subject.description,
      status: subject.status
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Code and Name are required');
      return;
    }

    try {
      if (modalMode === 'add') {
        await subjectService.createSubject(formData);
        toast.success(`Subject "${formData.name}" created successfully`);
      } else {
        await subjectService.updateSubject(activeSubject.id, formData);
        toast.success(`Subject "${formData.name}" updated successfully`);
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;
    setIsDeleting(true);
    try {
      await subjectService.deleteSubject(subjectToDelete.id);
      toast.success(`Subject "${subjectToDelete.name}" removed from curriculum`);
      setIsDeleteDialogOpen(false);
      setSubjectToDelete(null);
      fetchSubjects();
    } catch (err) {
      toast.error('Failed to delete subject');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Curriculum Subject Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure academic departments, course modules, and syllabus frameworks.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} leftIcon={Plus}>
          Add Academic Subject
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <Input
          id="search-subject"
          placeholder="Filter by subject code, course title, or academic department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <LoadingSkeleton variant="row" count={4} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FolderKanban}
              title="No subjects registered"
              description="Add your first academic subject or refine your search."
              actionLabel="Add Subject"
              onAction={handleOpenAdd}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Subject Code</th>
                  <th className="py-3.5 px-6">Course Name</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Exams</th>
                  <th className="py-3.5 px-6">Question Pool</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {sub.code}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 line-clamp-1">{sub.name}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {sub.description}
                      </p>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-700 font-medium">
                      {sub.department}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap font-semibold text-slate-900">
                      {sub.examCount} exams
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                      {sub.questionCount} items
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={sub.status === 'Active' ? 'success' : 'neutral'} size="sm" dot>
                        {sub.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(sub)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Subject"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSubjectToDelete(sub);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Subject"
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

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Register Academic Subject' : 'Modify Course Structure'}
        subtitle="Ensure curriculum identifiers adhere to statutory university regulation guidelines."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Subject Code"
              id="sub-code"
              placeholder="e.g. CS305"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <Select
              label="Curriculum Status"
              id="sub-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active (Syllabus Live)' },
                { value: 'Inactive', label: 'Inactive (Archived)' }
              ]}
            />
          </div>

          <Input
            label="Course Title"
            id="sub-name"
            placeholder="e.g. Compiler Design & Language Processing"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Department Assignment"
            id="sub-dept"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={[
              { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering' },
              { value: 'Information Technology', label: 'Information Technology' },
              { value: 'Data Science & AI', label: 'Data Science & AI' },
              { value: 'Applied Mathematics', label: 'Applied Mathematics' }
            ]}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Course Scope & Syllabus Summary</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of covered modules and objectives..."
              className="text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600 transition-colors"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {modalMode === 'add' ? 'Save Subject' : 'Update Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Academic Subject?"
        message={`Are you sure you want to delete "${subjectToDelete?.name}" (${subjectToDelete?.code})? This will archive all associated examination templates and question bank references.`}
        confirmText="Confirm Delete"
        variant="danger"
      />
    </div>
  );
};
