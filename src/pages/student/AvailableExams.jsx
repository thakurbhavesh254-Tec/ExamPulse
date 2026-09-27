import React, { useState, useEffect } from 'react';
import { examService } from '../../services/examService';
import { subjectService } from '../../services/subjectService';
import { ExamCard } from '../../components/student/ExamCard';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Search, Filter, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsData, subjectsData] = await Promise.all([
          examService.getExams(),
          subjectService.getSubjects()
        ]);
        setExams(examsData);
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Failed to load exams', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredExams = exams.filter((e) => {
    const matchesSearch =
      searchTerm === '' ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject === 'all' || e.subjectId === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || e.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  const subjectOptions = [
    { value: 'all', label: 'All Academic Subjects' },
    ...subjects.map((s) => ({ value: s.id, label: `${s.code} - ${s.name}` }))
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Examination Discovery Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse through departmental assessments, quizzes, and university mid-terms available for your semester.
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs self-start md:self-center">
          Showing <span className="font-bold text-slate-900">{filteredExams.length}</span> of {exams.length} examinations
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        <div className="lg:col-span-6">
          <Input
            id="search-exam"
            placeholder="Search by exam title, subject name, or course code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="lg:col-span-3">
          <Select
            id="filter-subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={subjectOptions}
            placeholder=""
          />
        </div>

        <div className="lg:col-span-3">
          <Select
            id="filter-difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            options={difficultyOptions}
            placeholder=""
          />
        </div>
      </div>

      {/* Exam Grid */}
      {isLoading ? (
        <LoadingSkeleton variant="card" count={6} />
      ) : filteredExams.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No examinations match your criteria"
          description="Try clearing your search keyword or switching subject filters to discover other available assessments."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedSubject('all');
            setSelectedDifficulty('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
};
