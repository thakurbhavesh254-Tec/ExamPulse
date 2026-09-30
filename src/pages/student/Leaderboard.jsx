import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await analyticsService.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="row" count={5} />
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header with NHITM College Branding Logo */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
        {/* Top-Left Official NHITM College Logo Container */}
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-md flex items-center gap-3">
          <img
            src="/assets/nhitm-official-logo.png"
            alt="New Horizon Institute of Technology & Management (NHITM)"
            className="h-12 sm:h-14 w-auto object-contain pointer-events-none rounded-lg"
          />
        </div>

        <div className="text-left md:text-right max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Academic Honor Roll &bull; 6th Semester</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Departmental Examination Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Recognizing consistent academic excellence across standardized university assessments and proctored examinations.
          </p>
        </div>
      </div>

      {/* Student Ranking Cards Grid (Top 3 + New Student Candidate Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-4">
        {/* Rank 1 - Gold (Valedictorian) */}
        {topThree[0] && (
          <div className="bg-gradient-to-b from-amber-50/70 to-white rounded-3xl border-2 border-amber-300 p-6 shadow-md text-center relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-0.5 rounded-full border border-amber-500 flex items-center gap-1 shadow-sm whitespace-nowrap">
              <Trophy className="w-3.5 h-3.5 text-slate-950" />
              <span>Rank 1 &bull; Valedictorian</span>
            </div>
            <div>
              <Avatar src={topThree[0].avatar} name={topThree[0].name} size="xl" className="mx-auto mb-3 ring-4 ring-amber-200" />
              <h3 className="text-base font-bold text-slate-900 leading-snug">{topThree[0].name}</h3>
              <p className="text-xs text-slate-500 font-mono mb-3">Roll No. {topThree[0].rollNo}</p>
              <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-2xs mb-3">
                <span className="text-2xl font-black text-amber-600 block">{topThree[0].averageScore}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Top Score Distinction</span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-block">
              {topThree[0].badge}
            </span>
          </div>
        )}

        {/* Rank 2 - Silver */}
        {topThree[1] && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs text-center relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-800 text-xs font-bold px-3 py-0.5 rounded-full border border-slate-300 flex items-center gap-1 shadow-2xs whitespace-nowrap">
              <Medal className="w-3.5 h-3.5 text-slate-600" />
              <span>Rank 2 &bull; Silver</span>
            </div>
            <div>
              <Avatar src={topThree[1].avatar} name={topThree[1].name} size="lg" className="mx-auto mb-3 ring-4 ring-slate-100" />
              <h3 className="text-base font-bold text-slate-900 leading-snug">{topThree[1].name}</h3>
              <p className="text-xs text-slate-400 font-mono mb-3">Roll No. {topThree[1].rollNo}</p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-3">
                <span className="text-2xl font-black text-slate-900 block">{topThree[1].averageScore}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Accuracy</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full inline-block">
              {topThree[1].badge}
            </span>
          </div>
        )}

        {/* Rank 3 - Bronze */}
        {topThree[2] && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs text-center relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-2xs whitespace-nowrap">
              <Medal className="w-3.5 h-3.5 text-amber-700" />
              <span>Rank 3 &bull; Bronze</span>
            </div>
            <div>
              <Avatar src={topThree[2].avatar} name={topThree[2].name} size="lg" className="mx-auto mb-3 ring-4 ring-amber-50" />
              <h3 className="text-base font-bold text-slate-900 leading-snug">{topThree[2].name}</h3>
              <p className="text-xs text-slate-400 font-mono mb-3">Roll No. {topThree[2].rollNo}</p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-3">
                <span className="text-2xl font-black text-slate-900 block">{topThree[2].averageScore}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Accuracy</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full inline-block">
              {topThree[2].badge}
            </span>
          </div>
        )}

        {/* Pranali Sangle Card (Roll No. 47) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs text-center relative flex flex-col justify-between">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-0.5 rounded-full border border-slate-300 flex items-center gap-1 shadow-2xs whitespace-nowrap">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Candidate &bull; Roll No. 47</span>
          </div>
          <div>
            <Avatar src={null} name="Pranali Sangle" size="lg" className="mx-auto mb-3 ring-4 ring-slate-100" />
            <h3 className="text-base font-bold text-slate-900 leading-snug">Pranali Sangle</h3>
            <p className="text-xs text-slate-400 font-mono mb-3">Roll No. 47</p>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-3">
              <span className="text-2xl font-black text-slate-400 block">—</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Accuracy</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full inline-block">
            Not Available
          </span>
        </div>
      </div>

      {/* Complete Rankings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Complete Cohort Rankings
          </h3>
          <span className="text-xs text-slate-500">
            Updated today following Mid-Term evaluation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Student Candidate</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Exams Graded</th>
                <th className="py-3.5 px-6">Average Score</th>
                <th className="py-3.5 px-6">Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.map((entry) => {
                const isCurrent = entry.id === user?.id || entry.isCurrentUser;
                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-indigo-50/90 font-medium'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                          entry.rank === 1
                            ? 'bg-amber-100 text-amber-800'
                            : entry.rank === 2
                            ? 'bg-slate-200 text-slate-700'
                            : entry.rank === 3
                            ? 'bg-amber-50 text-amber-700'
                            : isCurrent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {typeof entry.rank === 'number' ? `#${entry.rank}` : entry.rank}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar src={entry.avatar} name={entry.name} size="sm" />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{entry.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-indigo-600 text-white font-semibold px-1.5 py-0.2 rounded">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Roll No. {entry.rollNo}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                      {entry.department}
                    </td>

                    <td className="py-4 px-6 text-slate-900 font-semibold whitespace-nowrap">
                      {typeof entry.examsCompleted === 'number' ? `${entry.examsCompleted} completed` : entry.examsCompleted}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-sm font-extrabold text-slate-900">
                        {typeof entry.averageScore === 'number' ? `${entry.averageScore}%` : entry.averageScore}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={isCurrent ? 'brand' : 'neutral'} size="sm">
                        {entry.badge}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
