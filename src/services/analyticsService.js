// Analytics Service supporting DEMO and LIVE Spring Boot REST APIs

import { simulateDelay, getItem, STORAGE_KEYS, isLiveMode, liveRequest } from './apiClient';
import { PERFORMANCE_ANALYTICS, LEADERBOARD_DATA, ADMIN_ANALYTICS } from '../data/mockData';

export const analyticsService = {
  // GET /api/students/:id/performance
  async getStudentAnalytics(studentId) {
    if (isLiveMode()) {
      try {
        const perf = await liveRequest(`/students/${studentId}/performance`);
        return {
          totalAttemptsCount: perf.totalAttemptsCount || 0,
          averageScore: perf.averageScore || 0,
          scoreTrend: (perf.scoreTrend || []).map(s => ({
            exam: s.examTitle || s.exam || 'Exam',
            score: s.score || 0,
            classAvg: s.classAverage || 75
          })),
          subjectMastery: (perf.subjectMastery || []).map(m => ({
            subject: m.subjectName || m.subject,
            score: m.masteryPercentage || m.score || 0,
            exams: m.examsCount || m.exams || 1
          })),
          passFailDistribution: (perf.passFailDistribution || []).map(p => ({
            name: p.status || p.name,
            value: p.count || p.value || 0,
            color: p.color || (p.status === 'Passed Exams' ? '#10B981' : '#EF4444')
          })),
          recommendations: perf.insights || PERFORMANCE_ANALYTICS.recommendations
        };
      } catch (err) {
        console.warn('Could not fetch live performance, falling back to structured defaults', err);
      }
    }

    await simulateDelay(180);
    const attempts = getItem(STORAGE_KEYS.ATTEMPTS) || [];
    const myAttempts = attempts.filter(a => String(a.studentId) === String(studentId));

    return {
      ...PERFORMANCE_ANALYTICS,
      totalAttemptsCount: myAttempts.length > 0 ? myAttempts.length : 9,
      averageScore: myAttempts.length > 0 
        ? (myAttempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / myAttempts.length).toFixed(1)
        : '96.4'
    };
  },

  // GET /api/leaderboard
  async getLeaderboard() {
    if (isLiveMode()) {
      const list = await liveRequest('/leaderboard');
      if (Array.isArray(list)) {
        return list.map((item, idx) => ({
          rank: item.rank || (idx + 1),
          id: item.studentId,
          name: item.studentName,
          rollNo: item.studentRoll,
          avatar: item.avatar || null,
          department: item.department || 'Information Technology',
          examsCompleted: item.examsCompleted,
          totalScore: item.totalScore,
          averageScore: item.averageScore,
          streak: item.streak || 5,
          badge: item.badge || 'Institute Scholar',
          isCurrentUser: Boolean(item.isCurrentUser)
        }));
      }
    }

    await simulateDelay(150);
    return LEADERBOARD_DATA;
  },

  // GET /api/admin/analytics
  async getAdminAnalytics() {
    if (isLiveMode()) {
      const data = await liveRequest('/admin/analytics');
      return {
        kpis: {
          totalStudents: data.totalStudents || 0,
          activeExams: data.totalExams || 0,
          totalQuestions: data.totalQuestions || 0,
          totalSubmissions: data.totalAttempts || 0,
          overallPassRate: data.avgPassRate || 0,
          avgCompletionTimeMins: 24.0
        },
        overview: {
          totalStudents: data.totalStudents || 0,
          totalExams: data.totalExams || 0,
          totalQuestions: data.totalQuestions || 0,
          totalAttempts: data.totalAttempts || 0,
          avgPassRate: data.avgPassRate || 0,
          overallAvgScore: data.overallAvgScore || 0
        },
        participationTrend: (data.participationTrend || []).map(p => ({
          day: p.day || p.label,
          attempts: p.attemptsCount || p.attempts || 0,
          activeStudents: p.activeStudentsCount || p.activeStudents || 0
        })),
        departmentPerformance: (data.departmentBenchmarks || []).map(d => ({
          department: d.departmentName || d.department,
          avgScore: d.averageScore || d.avgScore || 0,
          students: d.studentsCount || d.students || 0,
          passRate: d.passRate || 0
        })),
        hardestQuestions: (data.hardestQuestions || []).map(h => ({
          id: h.questionId || h.id,
          subject: h.subjectCode || h.subject,
          text: h.questionText || h.text,
          failRate: h.failRatePercentage || h.failRate || 0
        })),
        recentActivity: (data.recentActivities || []).map(r => ({
          id: r.id || `act-${Math.random()}`,
          type: r.activityType || r.type,
          student: r.studentName || r.student,
          exam: r.examTitle || r.exam,
          time: r.timestamp || r.time || 'Recent',
          score: r.scoreInfo || r.score || 'N/A'
        }))
      };
    }

    await simulateDelay(200);
    const attempts = getItem(STORAGE_KEYS.ATTEMPTS) || [];
    const exams = getItem(STORAGE_KEYS.EXAMS) || [];
    const students = getItem(STORAGE_KEYS.STUDENTS) || [];
    const questions = getItem(STORAGE_KEYS.QUESTIONS) || [];

    const passedCount = attempts.filter(a => a.status === 'PASSED').length;
    const avgPassRate = attempts.length > 0 
      ? Number(((passedCount / attempts.length) * 100).toFixed(1))
      : 88.4;

    return {
      ...ADMIN_ANALYTICS,
      overview: {
        totalStudents: students.length,
        totalExams: exams.length,
        totalQuestions: questions.length,
        totalAttempts: attempts.length,
        avgPassRate,
        overallAvgScore: 84.6
      }
    };
  }
};
