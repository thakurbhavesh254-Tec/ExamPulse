import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resetToDefaults } from '../../services/apiClient';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Building,
  Mail,
  User,
  Lock
} from 'lucide-react';

export const AdminSettings = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Institution Profile State
  const [profileForm, setProfileForm] = useState({
    institution: 'Apex Institute of Science & Technology',
    deanName: user?.name || 'Prof. Rajesh Verma',
    deanEmail: user?.email || 'r.verma@apexuniv.edu.in',
    department: 'Office of the Controller of Examinations',
    sessionYear: '2025-2026'
  });

  // Examination Preferences State
  const [examPrefs, setExamPrefs] = useState({
    proctoringMode: 'strict',
    autoSubmitOnZero: true,
    tabSwitchLimit: 3,
    defaultPassingPercentage: 40,
    shuffleQuestions: true,
    showInstantSolutions: true
  });

  // Notifications State
  const [notifs, setNotifs] = useState({
    notifyOnExamSubmission: true,
    notifyOnProctorAlert: true,
    weeklyReportEmail: true
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Institution configuration updated successfully');
  };

  const handleSavePrefs = (e) => {
    e.preventDefault();
    toast.success('Examination proctoring preferences saved');
  };

  const handleResetData = () => {
    resetToDefaults();
    setShowResetConfirm(false);
    toast.success('All mock examination & student data has been reset to baseline defaults');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const tabs = [
    { id: 'profile', label: 'Institution Profile', icon: Building },
    { id: 'exam', label: 'Examination Rules', icon: Sliders },
    { id: 'notifications', label: 'Faculty Alerts', icon: Bell },
    { id: 'security', label: 'System & Data', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          System Administration Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure institutional accreditation parameters, proctoring thresholds, and security preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            University & Examination Office Details
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Identifiers displayed on generated candidate result transcripts.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Accredited University / Institute"
              id="inst-name"
              value={profileForm.institution}
              onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
              icon={Building}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Dean / Controller of Examination"
                id="dean-name"
                value={profileForm.deanName}
                onChange={(e) => setProfileForm({ ...profileForm, deanName: e.target.value })}
                icon={User}
                required
              />

              <Input
                label="Official Faculty Email"
                id="dean-email"
                type="email"
                value={profileForm.deanEmail}
                onChange={(e) => setProfileForm({ ...profileForm, deanEmail: e.target.value })}
                icon={Mail}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Department Division"
                id="dept-div"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
              />

              <Input
                label="Active Academic Term"
                id="term-year"
                value={profileForm.sessionYear}
                onChange={(e) => setProfileForm({ ...profileForm, sessionYear: e.target.value })}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                Save Institution Profile
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Exam Preferences */}
      {activeTab === 'exam' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Global Examination & Proctoring Protocol
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Default behaviors applied across all new test templates.
          </p>

          <form onSubmit={handleSavePrefs} className="space-y-4">
            <Select
              label="Proctoring Rigor Level"
              id="pref-proctor"
              value={examPrefs.proctoringMode}
              onChange={(e) => setExamPrefs({ ...examPrefs, proctoringMode: e.target.value })}
              options={[
                { value: 'strict', label: 'Strict (Tab blur warnings, right-click lock, fullscreen)' },
                { value: 'standard', label: 'Standard (Tab loss notification only)' },
                { value: 'lenient', label: 'Unproctored Practice Mode' }
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Maximum Tab Switches Allowed"
                id="pref-tab-switches"
                type="number"
                min="1"
                max="10"
                value={examPrefs.tabSwitchLimit}
                onChange={(e) => setExamPrefs({ ...examPrefs, tabSwitchLimit: Number(e.target.value) })}
              />

              <Input
                label="Default Minimum Pass Percentage (%)"
                id="pref-pass-pct"
                type="number"
                min="20"
                max="80"
                value={examPrefs.defaultPassingPercentage}
                onChange={(e) => setExamPrefs({ ...examPrefs, defaultPassingPercentage: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={examPrefs.autoSubmitOnZero}
                  onChange={(e) => setExamPrefs({ ...examPrefs, autoSubmitOnZero: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                />
                <span>Automatically submit and freeze responses when countdown reaches 00:00</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={examPrefs.shuffleQuestions}
                  onChange={(e) => setExamPrefs({ ...examPrefs, shuffleQuestions: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                />
                <span>Randomize question order across candidate sessions</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={examPrefs.showInstantSolutions}
                  onChange={(e) => setExamPrefs({ ...examPrefs, showInstantSolutions: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                />
                <span>Provide instantaneous answer keys and explanations upon test conclusion</span>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="sm">
                Save Examination Rules
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Faculty Alert Triggers
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Configure system alerts sent to the Examination Cell.
          </p>

          <div className="space-y-3 text-xs text-slate-700">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={notifs.notifyOnExamSubmission}
                onChange={(e) => setNotifs({ ...notifs, notifyOnExamSubmission: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300"
              />
              <div>
                <p className="font-bold text-slate-900">Exam Submission Notifications</p>
                <p className="text-slate-500 text-[11px]">Receive summary ping when a batch submits midterm exams.</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={notifs.notifyOnProctorAlert}
                onChange={(e) => setNotifs({ ...notifs, notifyOnProctorAlert: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300"
              />
              <div>
                <p className="font-bold text-slate-900">Security Proctor Incident Alerts</p>
                <p className="text-slate-500 text-[11px]">Instant flag when a candidate exceeds allowed tab blur threshold.</p>
              </div>
            </label>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => toast.success('Notification settings saved')}
            >
              Save Notification Preferences
            </Button>
          </div>
        </div>
      )}

      {/* TAB 4: Security & Data Reset */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Demo Database & Baseline Reset
            </h3>
            <p className="text-xs text-slate-500">
              Restore the mock environment to its clean initial university state.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
            <p className="font-bold">Reset Demo Workspace Data</p>
            <p className="leading-relaxed text-rose-800">
              This will reinitialize all subjects, questions, newly created exams, and submitted student test records to the baseline mock datasets.
            </p>
            <div className="pt-2">
              <Button
                variant="danger"
                size="sm"
                leftIcon={RotateCcw}
                onClick={() => setShowResetConfirm(true)}
              >
                Reset Data to Factory Defaults
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Data Reset Confirm Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetData}
        title="Reset Baseline Mock Data?"
        message="This action will clear all local changes made during your session and restore original university assessments and student records. Continue?"
        confirmText="Confirm Full Reset"
        variant="danger"
      />
    </div>
  );
};
