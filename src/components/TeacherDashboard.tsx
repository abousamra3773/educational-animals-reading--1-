import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Mystery } from '../types';
import { ClassLeaderboard } from './ClassLeaderboard';
import {
  GraduationCapIcon, UsersIcon, PlusIcon, XIcon, TrashIcon, EyeIcon,
  StarIcon, BookIcon, TargetIcon, ChartIcon, CheckIcon, PrinterIcon,
  EditIcon, SchoolIcon, SearchIcon, BarChartIcon, ClipboardListIcon,
  LoaderIcon, CloudCheckIcon, RefreshIcon, DownloadIcon, FileTextIcon,
  TrophyIcon
} from './icons/Icons';



// Types
interface StudentProgress {
  completedMysteries: string[];
  wordFamiliesMastered: string[];
  totalStars: number;
  gamesPlayed: number;
  averageScore: number;
  lastActive: string;
  streakDays: number;
}

interface ClassroomStudent {
  id: string;
  classroom_id: string;
  name: string;
  grade: string;
  added_at: string;
  notes: string;
  linked_user_id: string | null;
  progress: StudentProgress;
}

interface Classroom {
  id: string;
  teacher_id: string;
  name: string;
  grade_level: string;
  created_at: string;
  class_code: string;
  leaderboard_enabled: boolean;
  leaderboard_categories: string[];
}


interface TeacherDashboardProps {
  onOpenAuth: () => void;
}

const generateClassCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

// Generate realistic mock progress for demo students
const generateMockProgress = (mysteries: Mystery[]): StudentProgress => {
  const numCompleted = Math.floor(Math.random() * mysteries.length);
  const completedIds = mysteries.slice(0, numCompleted).map(m => m.id);
  const wordFamilies = mysteries.filter(m => completedIds.includes(m.id)).map(m => m.wordFamily);
  const daysAgo = Math.floor(Math.random() * 7);
  const lastActive = new Date(Date.now() - daysAgo * 86400000).toISOString();
  return {
    completedMysteries: completedIds,
    wordFamiliesMastered: wordFamilies,
    totalStars: numCompleted * 3 + Math.floor(Math.random() * 5),
    gamesPlayed: numCompleted * 2 + Math.floor(Math.random() * 8),
    averageScore: numCompleted > 0 ? 55 + Math.floor(Math.random() * 40) : 0,
    lastActive,
    streakDays: Math.floor(Math.random() * 14),
  };
};

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onOpenAuth }) => {
  const { mysteries } = useGame();
  const { isAuthenticated, user } = useAuth();

  // Data state
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<ClassroomStudent[]>([]);

  // UI state
  const [activeClassroom, setActiveClassroom] = useState<string | null>(null);
  const [showCreateClassroom, setShowCreateClassroom] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showStudentDetail, setShowStudentDetail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'roster' | 'analytics' | 'leaderboard' | 'settings'>('roster');


  // Loading / sync state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState<'student' | 'class' | null>(null);


  // Form state
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Kindergarten');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const [newStudentNotes, setNewStudentNotes] = useState('');
  const [bulkNames, setBulkNames] = useState('');

  // ============ DATABASE OPERATIONS ============

  // Fetch live progress for linked students
  const fetchLiveProgress = useCallback(async (studentsList: ClassroomStudent[]) => {
    const linkedStudents = studentsList.filter(s => s.linked_user_id);
    if (linkedStudents.length === 0) return studentsList;

    try {
      const userIds = linkedStudents.map(s => s.linked_user_id!);
      const { data, error } = await supabase.functions.invoke('sync-student-progress', {
        body: { action: 'fetch', user_ids: userIds }
      });

      if (error || !data?.success) return studentsList;

      const progressMap = data.progress || {};

      // Merge live progress into student records
      return studentsList.map(student => {
        if (!student.linked_user_id || !progressMap[student.linked_user_id]) return student;
        const liveProgress = progressMap[student.linked_user_id];
        return {
          ...student,
          progress: {
            completedMysteries: liveProgress.completedMysteries || [],
            wordFamiliesMastered: liveProgress.wordFamiliesMastered || [],
            totalStars: liveProgress.totalStars || 0,
            gamesPlayed: liveProgress.gamesPlayed || 0,
            averageScore: liveProgress.averageScore || 0,
            lastActive: liveProgress.lastActive || student.progress?.lastActive || '',
            streakDays: liveProgress.streakDays || 0,
          }
        };
      });
    } catch (err) {
      console.error('Failed to fetch live progress:', err);
      return studentsList;
    }
  }, []);

  const fetchClassrooms = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClassrooms(data || []);

      // If we have classrooms, fetch all students for them
      if (data && data.length > 0) {
        const classroomIds = data.map(c => c.id);
        const { data: studentsData, error: studentsError } = await supabase
          .from('classroom_students')
          .select('*')
          .in('classroom_id', classroomIds)
          .order('added_at', { ascending: true });

        if (studentsError) throw studentsError;

        // Fetch live progress for linked students
        const studentsWithLiveProgress = await fetchLiveProgress(studentsData || []);
        setStudents(studentsWithLiveProgress);

        // Auto-select first classroom if none selected
        if (!activeClassroom && data.length > 0) {
          setActiveClassroom(data[0].id);
        }
      } else {
        setStudents([]);
      }
      setSyncStatus('synced');
    } catch (err: any) {
      console.error('Failed to fetch classrooms:', err);
      setErrorMessage('Failed to load classroom data. Please try again.');
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, activeClassroom, fetchLiveProgress]);


  // Load data on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchClassrooms();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Derived data
  const currentClassroom = classrooms.find(c => c.id === activeClassroom) || null;
  const currentStudents = students.filter(s => s.classroom_id === activeClassroom);

  const filteredStudents = useMemo(() => {
    if (!currentClassroom) return [];
    if (!searchQuery.trim()) return currentStudents;
    const q = searchQuery.toLowerCase();
    return currentStudents.filter(s =>
      s.name.toLowerCase().includes(q) || s.grade.toLowerCase().includes(q)
    );
  }, [currentClassroom, currentStudents, searchQuery]);

  // Class analytics
  const classAnalytics = useMemo(() => {
    if (!currentClassroom || currentStudents.length === 0) return null;
    const studs = currentStudents;
    const totalStudents = studs.length;
    const avgStars = Math.round(studs.reduce((s, st) => s + (st.progress?.totalStars || 0), 0) / totalStudents);
    const avgScore = Math.round(studs.reduce((s, st) => s + (st.progress?.averageScore || 0), 0) / totalStudents);
    const avgMysteries = Math.round((studs.reduce((s, st) => s + (st.progress?.completedMysteries?.length || 0), 0) / totalStudents) * 10) / 10;
    const avgWordFamilies = Math.round((studs.reduce((s, st) => s + (st.progress?.wordFamiliesMastered?.length || 0), 0) / totalStudents) * 10) / 10;
    const activeToday = studs.filter(s => {
      if (!s.progress?.lastActive) return false;
      const last = new Date(s.progress.lastActive);
      const today = new Date();
      return last.toDateString() === today.toDateString();
    }).length;

    const wordFamilyStats = mysteries.map(m => {
      const mastered = studs.filter(s => s.progress?.wordFamiliesMastered?.includes(m.wordFamily)).length;
      return { family: m.wordFamily, mastered, total: totalStudents, percentage: Math.round((mastered / totalStudents) * 100) };
    });

    const scoreRanges = [
      { label: '90-100%', min: 90, max: 100, count: 0, color: 'bg-green-500' },
      { label: '80-89%', min: 80, max: 89, count: 0, color: 'bg-emerald-400' },
      { label: '70-79%', min: 70, max: 79, count: 0, color: 'bg-yellow-400' },
      { label: '60-69%', min: 60, max: 69, count: 0, color: 'bg-orange-400' },
      { label: 'Below 60%', min: 0, max: 59, count: 0, color: 'bg-red-400' },
    ];
    studs.forEach(s => {
      const score = s.progress?.averageScore || 0;
      const range = scoreRanges.find(r => score >= r.min && score <= r.max);
      if (range) range.count++;
    });

    return { totalStudents, avgStars, avgScore, avgMysteries, avgWordFamilies, activeToday, wordFamilyStats, scoreRanges };
  }, [currentClassroom, currentStudents, mysteries]);

  // ============ HANDLERS ============

  const handleCreateClassroom = async () => {
    if (!newClassName.trim() || !user?.id) return;
    setIsSaving(true);
    setSyncStatus('saving');
    try {
      const classCode = generateClassCode();
      const { data, error } = await supabase
        .from('classrooms')
        .insert({
          teacher_id: user.id,
          name: newClassName.trim(),
          grade_level: newClassGrade,
          class_code: classCode,
        })
        .select()
        .single();

      if (error) throw error;

      setClassrooms(prev => [data, ...prev]);
      setActiveClassroom(data.id);
      setShowCreateClassroom(false);
      setNewClassName('');
      setNewClassGrade('Kindergarten');
      setSyncStatus('synced');
    } catch (err: any) {
      console.error('Failed to create classroom:', err);
      setErrorMessage('Failed to create classroom. Please try again.');
      setSyncStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudentName.trim() || !activeClassroom) return;
    setIsSaving(true);
    setSyncStatus('saving');
    try {
      const progress = generateMockProgress(mysteries);
      const { data, error } = await supabase
        .from('classroom_students')
        .insert({
          classroom_id: activeClassroom,
          name: newStudentName.trim(),
          grade: newStudentGrade || currentClassroom?.grade_level || '',
          notes: newStudentNotes,
          progress,
        })
        .select()
        .single();

      if (error) throw error;

      setStudents(prev => [...prev, data]);
      setNewStudentName('');
      setNewStudentNotes('');
      setNewStudentGrade('');
      setShowAddStudent(false);
      setSyncStatus('synced');
    } catch (err: any) {
      console.error('Failed to add student:', err);
      setErrorMessage('Failed to add student. Please try again.');
      setSyncStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkAdd = async () => {
    if (!bulkNames.trim() || !activeClassroom) return;
    setIsSaving(true);
    setSyncStatus('saving');
    try {
      const names = bulkNames.split('\n').map(n => n.trim()).filter(n => n.length > 0);
      const newStudentsData = names.map(name => ({
        classroom_id: activeClassroom,
        name,
        grade: currentClassroom?.grade_level || '',
        notes: '',
        progress: generateMockProgress(mysteries),
      }));

      const { data, error } = await supabase
        .from('classroom_students')
        .insert(newStudentsData)
        .select();

      if (error) throw error;

      setStudents(prev => [...prev, ...(data || [])]);
      setBulkNames('');
      setShowAddStudent(false);
      setSyncStatus('synced');
    } catch (err: any) {
      console.error('Failed to bulk add students:', err);
      setErrorMessage('Failed to add students. Please try again.');
      setSyncStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!activeClassroom) return;
    setIsSaving(true);
    setSyncStatus('saving');
    try {
      const { error } = await supabase
        .from('classroom_students')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      setStudents(prev => prev.filter(s => s.id !== studentId));
      if (showStudentDetail === studentId) setShowStudentDetail(null);
      setSyncStatus('synced');
    } catch (err: any) {
      console.error('Failed to remove student:', err);
      setErrorMessage('Failed to remove student. Please try again.');
      setSyncStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClassroom = async (classroomId: string) => {
    setIsSaving(true);
    setSyncStatus('saving');
    try {
      // Students will be cascade deleted due to ON DELETE CASCADE
      const { error } = await supabase
        .from('classrooms')
        .delete()
        .eq('id', classroomId);

      if (error) throw error;

      setClassrooms(prev => prev.filter(c => c.id !== classroomId));
      setStudents(prev => prev.filter(s => s.classroom_id !== classroomId));
      if (activeClassroom === classroomId) {
        const remaining = classrooms.filter(c => c.id !== classroomId);
        setActiveClassroom(remaining.length > 0 ? remaining[0].id : null);
      }
      setSyncStatus('synced');
    } catch (err: any) {
      console.error('Failed to delete classroom:', err);
      setErrorMessage('Failed to delete classroom. Please try again.');
      setSyncStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateClassroom = async (field: string, value: string) => {
    if (!activeClassroom) return;
    setSyncStatus('saving');
    try {
      const { error } = await supabase
        .from('classrooms')
        .update({ [field]: value })
        .eq('id', activeClassroom);

      if (error) throw error;

      setClassrooms(prev => prev.map(c =>
        c.id === activeClassroom ? { ...c, [field]: value } : c
      ));
      setSyncStatus('synced');
    } catch (err: any) {
      console.error('Failed to update classroom:', err);
      setSyncStatus('error');
    }
  };

  const handleUpdateStudentNotes = async (studentId: string, notes: string) => {
    // Optimistic update
    setStudents(prev => prev.map(s =>
      s.id === studentId ? { ...s, notes } : s
    ));

    try {
      const { error } = await supabase
        .from('classroom_students')
        .update({ notes })
        .eq('id', studentId);

      if (error) throw error;
      setSyncStatus('synced');
    } catch (err: any) {
      console.error('Failed to update notes:', err);
      setSyncStatus('error');
    }
  };

  // Debounced classroom name/grade update
  const [pendingClassUpdate, setPendingClassUpdate] = useState<{ field: string; value: string } | null>(null);
  useEffect(() => {
    if (!pendingClassUpdate) return;
    const timer = setTimeout(() => {
      handleUpdateClassroom(pendingClassUpdate.field, pendingClassUpdate.value);
      setPendingClassUpdate(null);
    }, 800);
    return () => clearTimeout(timer);
  }, [pendingClassUpdate]);

  // Debounced notes update
  const [pendingNotesUpdate, setPendingNotesUpdate] = useState<{ id: string; notes: string } | null>(null);
  useEffect(() => {
    if (!pendingNotesUpdate) return;
    const timer = setTimeout(() => {
      handleUpdateStudentNotes(pendingNotesUpdate.id, pendingNotesUpdate.notes);
      setPendingNotesUpdate(null);
    }, 800);
    return () => clearTimeout(timer);
  }, [pendingNotesUpdate]);

  // ============ REPORT CARD GENERATION ============

  const downloadPdfBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateStudentReport = async (student: ClassroomStudent) => {
    if (!currentClassroom || generatingReport) return;
    setGeneratingReport('student');
    try {
      const mysteriesData = mysteries.map(m => ({
        id: m.id,
        title: m.title,
        wordFamily: m.wordFamily,
        difficulty: m.difficulty,
      }));

      const { data, error } = await supabase.functions.invoke('generate-report-card', {
        body: {
          reportType: 'individual',
          student: {
            name: student.name,
            grade: student.grade,
            notes: student.notes,
            linked_user_id: student.linked_user_id,
            progress: student.progress,
          },
          classroom: {
            name: currentClassroom.name,
            grade_level: currentClassroom.grade_level,
            class_code: currentClassroom.class_code,
          },
          mysteries: mysteriesData,
        },
      });

      if (error) throw error;

      // The response is a PDF blob
      const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
      const filename = `${student.name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '_')}_Report_Card.pdf`;
      downloadPdfBlob(blob, filename);
    } catch (err: any) {
      console.error('Failed to generate student report:', err);
      setErrorMessage('Failed to generate report card. Please try again.');
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleGenerateClassReport = async () => {
    if (!currentClassroom || generatingReport) return;
    setGeneratingReport('class');
    try {
      const mysteriesData = mysteries.map(m => ({
        id: m.id,
        title: m.title,
        wordFamily: m.wordFamily,
        difficulty: m.difficulty,
      }));

      const studentsData = currentStudents.map(s => ({
        name: s.name,
        grade: s.grade,
        notes: s.notes,
        linked_user_id: s.linked_user_id,
        progress: s.progress,
      }));

      const { data, error } = await supabase.functions.invoke('generate-report-card', {
        body: {
          reportType: 'class',
          classroom: {
            name: currentClassroom.name,
            grade_level: currentClassroom.grade_level,
            class_code: currentClassroom.class_code,
          },
          students: studentsData,
          mysteries: mysteriesData,
        },
      });

      if (error) throw error;

      const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
      const filename = `${currentClassroom.name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '_')}_Class_Report.pdf`;
      downloadPdfBlob(blob, filename);
    } catch (err: any) {
      console.error('Failed to generate class report:', err);
      setErrorMessage('Failed to generate class report. Please try again.');
    } finally {
      setGeneratingReport(null);
    }
  };


  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getActivityStatus = (lastActive: string) => {
    if (!lastActive) return { label: 'Never', color: 'bg-gray-100 text-gray-500' };
    const diff = Date.now() - new Date(lastActive).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return { label: 'Active today', color: 'bg-green-100 text-green-700' };
    if (days <= 2) return { label: `${days}d ago`, color: 'bg-blue-100 text-blue-700' };
    if (days <= 7) return { label: `${days}d ago`, color: 'bg-amber-100 text-amber-700' };
    return { label: `${days}d ago`, color: 'bg-red-100 text-red-700' };
  };

  const selectedStudent = currentStudents.find(s => s.id === showStudentDetail) || null;

  // ============ SYNC STATUS INDICATOR ============
  const SyncIndicator = () => (
    <div className="flex items-center gap-2 text-xs">
      {syncStatus === 'synced' && (
        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
          <CloudCheckIcon size={14} />
          Saved to cloud
        </span>
      )}
      {syncStatus === 'saving' && (
        <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          <LoaderIcon size={14} />
          Saving...
        </span>
      )}
      {syncStatus === 'error' && (
        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-full cursor-pointer" onClick={fetchClassrooms}>
          <RefreshIcon size={14} />
          Sync error - click to retry
        </span>
      )}
    </div>
  );

  // ============ RENDER ============

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <GraduationCapIcon className="text-white" size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Teacher Dashboard</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Sign in to access your classroom dashboard. Your data is saved to the cloud so you can access it from any device.
          </p>
          <button
            onClick={onOpenAuth}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Sign In to Get Started
          </button>
        </div>
      </section>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <LoaderIcon className="mx-auto text-blue-500 mb-4" size={48} />
          <p className="text-gray-600 text-lg">Loading your classrooms...</p>
        </div>
      </section>
    );
  }

  // Error banner
  const ErrorBanner = () => errorMessage ? (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
      <p className="text-red-700 text-sm">{errorMessage}</p>
      <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600">
        <XIcon size={16} />
      </button>
    </div>
  ) : null;

  // No classrooms yet - show setup
  if (classrooms.length === 0 && !showCreateClassroom) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorBanner />
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <GraduationCapIcon className="text-white" size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Teacher Dashboard</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Set up your classroom, add your students, and track their reading progress all in one place.
              Your data is automatically saved to the cloud.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: ClipboardListIcon, title: 'Classroom Roster', desc: 'Add students individually or in bulk. Organize by grade level.', color: 'from-blue-400 to-blue-500' },
              { icon: ChartIcon, title: 'Track Progress', desc: 'View each student\'s completed mysteries, scores, and word families.', color: 'from-green-400 to-emerald-500' },
              { icon: CloudCheckIcon, title: 'Cloud Synced', desc: 'Access your classroom data from any device. Everything saves automatically.', color: 'from-purple-400 to-indigo-500' },
            ].map((feat, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className={`w-14 h-14 bg-gradient-to-br ${feat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feat.icon className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowCreateClassroom(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-lg inline-flex items-center gap-3"
            >
              <PlusIcon size={24} />
              Create Your First Classroom
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <ErrorBanner />

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCapIcon className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Teacher Dashboard</h2>
              <p className="text-gray-500">Manage your classrooms and track student progress</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SyncIndicator />
            <button
              onClick={() => setShowCreateClassroom(true)}
              className="bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <PlusIcon size={18} />
              New Classroom
            </button>
          </div>
        </div>

        {/* Classroom Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {classrooms.map(c => {
            const studentCount = students.filter(s => s.classroom_id === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => { setActiveClassroom(c.id); setActiveTab('roster'); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeClassroom === c.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                <SchoolIcon size={18} />
                {c.name}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeClassroom === c.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {studentCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Classroom Content */}
        {currentClassroom && (
          <>
            {/* Classroom Info Bar */}
            <div className="bg-white rounded-2xl shadow-md p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-sm">
                  {currentClassroom.grade_level}
                </span>
                <span className="text-gray-500 text-sm">
                  {currentStudents.length} students
                </span>
                <span className="bg-indigo-50 text-indigo-600 font-mono font-bold px-3 py-1 rounded-lg text-sm" title="Class join code">
                  Code: {currentClassroom.class_code}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {([
                  { key: 'roster', label: 'Roster' },
                  { key: 'analytics', label: 'Analytics' },
                  { key: 'leaderboard', label: 'Leaderboard', icon: TrophyIcon },
                  { key: 'settings', label: 'Settings' },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === tab.key
                        ? tab.key === 'leaderboard' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {'icon' in tab && tab.icon && <tab.icon size={14} />}
                    {tab.label}
                  </button>
                ))}
              </div>

            </div>

            {/* ROSTER TAB */}
            {activeTab === 'roster' && (
              <div>
                {/* Search + Add */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddStudent(true)}
                    className="bg-green-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <PlusIcon size={18} />
                    Add Students
                  </button>
                </div>

                {/* Student List */}
                {filteredStudents.length > 0 ? (
                  <div className="space-y-3">
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <div className="col-span-3">Student</div>
                      <div className="col-span-2">Mysteries</div>
                      <div className="col-span-2">Avg Score</div>
                      <div className="col-span-2">Word Families</div>
                      <div className="col-span-1">Stars</div>
                      <div className="col-span-1">Activity</div>
                      <div className="col-span-1">Actions</div>
                    </div>

                    {filteredStudents.map(student => {
                      const activity = getActivityStatus(student.progress?.lastActive || '');
                      return (
                        <div
                          key={student.id}
                          className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all p-4 md:p-5"
                        >
                          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 items-center">
                            {/* Name */}
                            {/* Name */}
                            <div className="col-span-2 md:col-span-3 flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                                student.linked_user_id
                                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 ring-2 ring-green-200'
                                  : 'bg-gradient-to-br from-blue-400 to-indigo-400'
                              }`}>
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-gray-800 truncate">{student.name}</p>
                                  {student.linked_user_id ? (
                                    <span className="flex items-center gap-0.5 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" title="Live progress from student's account">
                                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
                                      LIVE
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-400 font-medium flex-shrink-0">Manual</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400">{student.grade}</p>
                              </div>
                            </div>


                            {/* Mysteries */}
                            <div className="md:col-span-2">
                              <div className="flex items-center gap-2">
                                <div className="w-full max-w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${((student.progress?.completedMysteries?.length || 0) / Math.max(1, mysteries.length)) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                  {student.progress?.completedMysteries?.length || 0}/{mysteries.length}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 md:hidden mt-0.5">Mysteries</p>
                            </div>

                            {/* Score */}
                            <div className="md:col-span-2">
                              <span className={`inline-block px-2.5 py-1 rounded-lg text-sm font-bold ${getScoreColor(student.progress?.averageScore || 0)}`}>
                                {(student.progress?.averageScore || 0) > 0 ? `${student.progress.averageScore}%` : '--'}
                              </span>
                              <p className="text-xs text-gray-400 md:hidden mt-0.5">Avg Score</p>
                            </div>

                            {/* Word Families */}
                            <div className="md:col-span-2">
                              <span className="text-sm font-semibold text-purple-600">
                                {student.progress?.wordFamiliesMastered?.length || 0}
                              </span>
                              <span className="text-xs text-gray-400"> mastered</span>
                              <p className="text-xs text-gray-400 md:hidden mt-0.5">Word Families</p>
                            </div>

                            {/* Stars */}
                            <div className="md:col-span-1 flex items-center gap-1">
                              <StarIcon size={14} filled className="text-yellow-400" />
                              <span className="text-sm font-bold text-gray-700">{student.progress?.totalStars || 0}</span>
                            </div>

                            {/* Activity */}
                            <div className="md:col-span-1">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${activity.color}`}>
                                {activity.label}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="md:col-span-1 flex items-center gap-1 justify-end">
                              <button
                                onClick={() => setShowStudentDetail(student.id)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View details"
                              >
                                <EyeIcon size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Remove ${student.name} from this classroom?`)) {
                                    handleRemoveStudent(student.id);
                                  }
                                }}
                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove student"
                              >
                                <TrashIcon size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                    <UsersIcon className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">
                      {searchQuery ? 'No students match your search.' : 'No students yet.'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => setShowAddStudent(true)}
                        className="mt-4 bg-green-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors inline-flex items-center gap-2"
                      >
                        <PlusIcon size={18} />
                        Add Your First Student
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && classAnalytics && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Students', value: classAnalytics.totalStudents, icon: UsersIcon, gradient: 'from-blue-500 to-blue-600' },
                    { label: 'Avg Score', value: `${classAnalytics.avgScore}%`, icon: TargetIcon, gradient: 'from-green-500 to-emerald-600' },
                    { label: 'Avg Mysteries', value: classAnalytics.avgMysteries, icon: BookIcon, gradient: 'from-purple-500 to-indigo-600' },
                    { label: 'Active Today', value: classAnalytics.activeToday, icon: StarIcon, gradient: 'from-amber-500 to-orange-600' },
                  ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 text-white`}>
                      <stat.icon size={28} className="mb-2 opacity-80" />
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-white/80 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Score Distribution */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChartIcon size={20} className="text-blue-500" />
                    Score Distribution
                  </h3>
                  <div className="space-y-3">
                    {classAnalytics.scoreRanges.map(range => (
                      <div key={range.label} className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 w-24 text-right">{range.label}</span>
                        <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                          <div
                            className={`h-full ${range.color} rounded-lg transition-all flex items-center justify-end pr-2`}
                            style={{ width: `${Math.max(5, (range.count / classAnalytics.totalStudents) * 100)}%` }}
                          >
                            {range.count > 0 && (
                              <span className="text-white text-xs font-bold">{range.count}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-8">{range.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Word Family Mastery */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookIcon size={20} className="text-purple-500" />
                    Word Family Mastery
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {classAnalytics.wordFamilyStats.map(wf => (
                      <div key={wf.family} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-purple-700">{wf.family}</span>
                          <span className="text-sm font-semibold text-gray-600">
                            {wf.mastered}/{wf.total} students
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              wf.percentage >= 80 ? 'bg-green-500' :
                              wf.percentage >= 50 ? 'bg-amber-400' :
                              'bg-red-400'
                            }`}
                            style={{ width: `${wf.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{wf.percentage}% mastery rate</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Students Needing Attention */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <EyeIcon size={20} className="text-amber-500" />
                    Students Needing Attention
                  </h3>
                  {(() => {
                    const needsAttention = currentStudents
                      .filter(s => (s.progress?.averageScore || 0) < 60 || (s.progress?.completedMysteries?.length || 0) === 0)
                      .sort((a, b) => (a.progress?.averageScore || 0) - (b.progress?.averageScore || 0));
                    if (needsAttention.length === 0) {
                      return (
                        <div className="text-center py-6 text-gray-400">
                          <CheckIcon className="mx-auto mb-2 text-green-400" size={32} />
                          <p className="text-green-600 font-medium">All students are on track!</p>
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-3">
                        {needsAttention.map(s => (
                          <div key={s.id} className="flex items-center justify-between bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 font-bold">
                                {s.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">{s.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(s.progress?.completedMysteries?.length || 0) === 0
                                    ? 'No mysteries completed yet'
                                    : `Average score: ${s.progress?.averageScore || 0}%`}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowStudentDetail(s.id)}
                              className="text-blue-500 font-semibold text-sm hover:text-blue-700 transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Report Actions */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleGenerateClassReport}
                    disabled={generatingReport === 'class'}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {generatingReport === 'class' ? (
                      <>
                        <LoaderIcon size={18} />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <DownloadIcon size={18} />
                        Download Class Report PDF
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-100 text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <PrinterIcon size={18} />
                    Print Class Report
                  </button>
                </div>

              </div>
            )}

            {activeTab === 'analytics' && !classAnalytics && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <ChartIcon className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">Add students to see class analytics.</p>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl space-y-6">
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Classroom Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Classroom Name</label>
                      <input
                        type="text"
                        value={currentClassroom.name}
                        onChange={e => {
                          const value = e.target.value;
                          setClassrooms(prev => prev.map(c =>
                            c.id === activeClassroom ? { ...c, name: value } : c
                          ));
                          setPendingClassUpdate({ field: 'name', value });
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Grade Level</label>
                      <select
                        value={currentClassroom.grade_level}
                        onChange={e => {
                          const value = e.target.value;
                          setClassrooms(prev => prev.map(c =>
                            c.id === activeClassroom ? { ...c, grade_level: value } : c
                          ));
                          handleUpdateClassroom('grade_level', value);
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        {['Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade'].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Class Join Code</label>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-lg text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
                          {currentClassroom.class_code}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(currentClassroom.class_code);
                          }}
                          className="text-sm text-blue-500 hover:text-blue-700 font-semibold"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Share this code with students/parents to join your classroom.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CloudCheckIcon size={20} className="text-green-500" />
                    <h3 className="text-lg font-bold text-gray-800">Cloud Storage</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    Your classroom data is automatically saved to the cloud. You can access it from any device by signing in with the same account.
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <SyncIndicator />
                    <button
                      onClick={fetchClassrooms}
                      className="text-sm text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      <RefreshIcon size={14} />
                      Refresh Data
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Deleting a classroom will permanently remove all student data associated with it. This cannot be undone.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${currentClassroom.name}"? This will permanently remove all student data and cannot be undone.`)) {
                        handleDeleteClassroom(currentClassroom.id);
                      }
                    }}
                    disabled={isSaving}
                    className="bg-red-100 text-red-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <TrashIcon size={18} />
                    Delete Classroom
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* CREATE CLASSROOM MODAL */}
        {showCreateClassroom && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <SchoolIcon size={24} className="text-blue-500" />
                  Create Classroom
                </h3>
                <button onClick={() => setShowCreateClassroom(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <XIcon size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Classroom Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Smith's Reading Stars"
                    value={newClassName}
                    onChange={e => setNewClassName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Grade Level</label>
                  <select
                    value={newClassGrade}
                    onChange={e => setNewClassGrade(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
                  >
                    {['Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateClassroom(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClassroom}
                  disabled={!newClassName.trim() || isSaving}
                  className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? <LoaderIcon size={18} /> : null}
                  {isSaving ? 'Creating...' : 'Create Classroom'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD STUDENT MODAL */}
        {showAddStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <PlusIcon size={24} className="text-green-500" />
                  Add Students
                </h3>
                <button onClick={() => setShowAddStudent(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <XIcon size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Single Student */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Add Individual Student</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Student name"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Grade (optional)"
                    value={newStudentGrade}
                    onChange={e => setNewStudentGrade(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400"
                  />
                  <textarea
                    placeholder="Notes (optional) - e.g. IEP, reading level, etc."
                    value={newStudentNotes}
                    onChange={e => setNewStudentNotes(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 resize-none"
                  />
                  <button
                    onClick={handleAddStudent}
                    disabled={!newStudentName.trim() || isSaving}
                    className="w-full bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <LoaderIcon size={18} /> : null}
                    {isSaving ? 'Adding...' : 'Add Student'}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Bulk Add (one name per line)</h4>
                <textarea
                  placeholder={"Emma Johnson\nLiam Wilson\nSophia Martinez\nNoah Brown"}
                  value={bulkNames}
                  onChange={e => setBulkNames(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 resize-none font-mono text-sm"
                />
                <button
                  onClick={handleBulkAdd}
                  disabled={!bulkNames.trim() || isSaving}
                  className="w-full mt-3 bg-indigo-500 text-white font-semibold py-3 rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <LoaderIcon size={18} /> : null}
                  {isSaving ? 'Adding...' : 'Add All Students'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT DETAIL MODAL */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      selectedStudent.linked_user_id
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 ring-2 ring-green-200'
                        : 'bg-gradient-to-br from-blue-400 to-indigo-400'
                    }`}>
                      {selectedStudent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h3>
                        {selectedStudent.linked_user_id ? (
                          <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
                            LIVE DATA
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">Not linked</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{selectedStudent.grade} — Added {new Date(selectedStudent.added_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowStudentDetail(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <XIcon size={20} className="text-gray-400" />
                  </button>
                </div>
                {selectedStudent.linked_user_id && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    This student's account is linked — progress data updates automatically from their gameplay.
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedStudent.progress?.completedMysteries?.length || 0}</p>
                    <p className="text-xs text-gray-500">Mysteries</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedStudent.progress?.averageScore || 0}%</p>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedStudent.progress?.wordFamiliesMastered?.length || 0}</p>
                    <p className="text-xs text-gray-500">Word Families</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-amber-600">{selectedStudent.progress?.totalStars || 0}</p>
                    <p className="text-xs text-gray-500">Stars</p>
                  </div>
                </div>

                {/* Completed Mysteries */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3">Completed Mysteries</h4>
                  {(selectedStudent.progress?.completedMysteries?.length || 0) > 0 ? (
                    <div className="space-y-2">
                      {selectedStudent.progress.completedMysteries.map(mId => {
                        const mystery = mysteries.find(m => m.id === mId);
                        if (!mystery) return null;
                        return (
                          <div key={mId} className="flex items-center gap-3 bg-green-50 rounded-xl p-3 border border-green-100">
                            <CheckIcon className="text-green-500 flex-shrink-0" size={18} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate">{mystery.title}</p>
                              <p className="text-xs text-gray-500">{mystery.wordFamily} family</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm bg-gray-50 rounded-xl p-4 text-center">No mysteries completed yet.</p>
                  )}
                </div>

                {/* Word Families */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3">Word Families Mastered</h4>
                  {(selectedStudent.progress?.wordFamiliesMastered?.length || 0) > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.progress.wordFamiliesMastered.map(wf => (
                        <span key={wf} className="bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-lg text-sm">{wf}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm bg-gray-50 rounded-xl p-4 text-center">No word families mastered yet.</p>
                  )}
                </div>

                {/* Teacher Notes */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <EditIcon size={16} className="text-gray-500" />
                    Teacher Notes
                  </h4>
                  <textarea
                    value={selectedStudent.notes || ''}
                    onChange={e => {
                      const notes = e.target.value;
                      setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, notes } : s));
                      setPendingNotesUpdate({ id: selectedStudent.id, notes });
                    }}
                    placeholder="Add notes about this student..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 resize-none text-sm"
                  />
                </div>

                {/* Activity */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Last Active</p>
                    <p className="font-semibold text-gray-700">
                      {selectedStudent.progress?.lastActive
                        ? new Date(selectedStudent.progress.lastActive).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                        : 'Never'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Reading Streak</p>
                    <p className="font-bold text-orange-600">{selectedStudent.progress?.streakDays || 0} days</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-4 flex flex-col sm:flex-row gap-3 sm:justify-between">
                <button
                  onClick={() => handleGenerateStudentReport(selectedStudent)}
                  disabled={generatingReport === 'student'}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {generatingReport === 'student' ? (
                    <>
                      <LoaderIcon size={18} />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileTextIcon size={18} />
                      Generate Report Card
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowStudentDetail(null)}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};

