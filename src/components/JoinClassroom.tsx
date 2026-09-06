import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  GraduationCapIcon, SchoolIcon, CheckIcon, XIcon, LoaderIcon,
  UsersIcon, SearchIcon, TrashIcon
} from './icons/Icons';

interface ClassroomInfo {
  id: string;
  name: string;
  grade_level: string;
  student_count: number;
}

interface JoinedClassroom {
  id: string;
  name: string;
  grade_level: string;
  class_code: string;
  student_name: string;
  student_id: string;
}

interface JoinClassroomProps {
  onOpenAuth: () => void;
}

export const JoinClassroom: React.FC<JoinClassroomProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated } = useAuth();
  const [classCode, setClassCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');
  const [classroomInfo, setClassroomInfo] = useState<ClassroomInfo | null>(null);
  const [joinedClassrooms, setJoinedClassrooms] = useState<JoinedClassroom[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLoadingClassrooms, setIsLoadingClassrooms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showJoinForm, setShowJoinForm] = useState(false);

  // Load joined classrooms
  const loadJoinedClassrooms = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingClassrooms(true);
    try {
      const { data, error } = await supabase.functions.invoke('join-classroom', {
        body: { action: 'get-classrooms', user_id: user.id }
      });

      if (!error && data?.success) {
        setJoinedClassrooms(data.classrooms || []);
      }
    } catch (err) {
      console.error('Failed to load classrooms:', err);
    } finally {
      setIsLoadingClassrooms(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadJoinedClassrooms();
    }
  }, [isAuthenticated, user?.id, loadJoinedClassrooms]);

  // Pre-fill student name from user display name
  useEffect(() => {
    if (user?.displayName && !studentName) {
      setStudentName(user.displayName);
    }
  }, [user?.displayName]);

  const handleValidateCode = async () => {
    if (!classCode.trim()) return;
    setIsValidating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('join-classroom', {
        body: { action: 'validate', class_code: classCode.trim().toUpperCase() }
      });

      if (fnError) {
        setError('Unable to validate code. Please try again.');
        setIsValidating(false);
        return;
      }

      if (data?.error) {
        setError(data.error);
        setIsValidating(false);
        return;
      }

      if (data?.success && data.classroom) {
        setClassroomInfo(data.classroom);
        setStep('confirm');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleJoinClassroom = async () => {
    if (!classroomInfo || !user?.id || !studentName.trim()) return;
    setIsJoining(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('join-classroom', {
        body: {
          action: 'join',
          class_code: classCode.trim().toUpperCase(),
          user_id: user.id,
          student_name: studentName.trim()
        }
      });

      if (fnError) {
        setError('Unable to join classroom. Please try again.');
        setIsJoining(false);
        return;
      }

      if (data?.error) {
        setError(data.error);
        setIsJoining(false);
        return;
      }

      if (data?.success) {
        setSuccessMessage(data.message || 'Successfully joined classroom!');
        setStep('success');
        loadJoinedClassrooms();
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveClassroom = async (classCode: string, classroomName: string) => {
    if (!user?.id) return;
    if (!window.confirm(`Are you sure you want to leave "${classroomName}"? Your teacher will no longer see your progress.`)) return;

    try {
      const { data, error: fnError } = await supabase.functions.invoke('join-classroom', {
        body: { action: 'leave', user_id: user.id, class_code: classCode }
      });

      if (!fnError && data?.success) {
        loadJoinedClassrooms();
      }
    } catch (err) {
      console.error('Failed to leave classroom:', err);
    }
  };

  const resetForm = () => {
    setClassCode('');
    setStudentName(user?.displayName || '');
    setStep('input');
    setClassroomInfo(null);
    setError(null);
    setSuccessMessage(null);
    setShowJoinForm(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
            <GraduationCapIcon className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Join a Classroom</h3>
            <p className="text-sm text-gray-500">Connect with your teacher to share progress</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          Sign in to join your teacher's classroom. Your teacher will give you a 6-character class code.
        </p>
        <button
          onClick={onOpenAuth}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
        >
          Sign In to Join
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
            <GraduationCapIcon className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">My Classrooms</h3>
            <p className="text-sm text-gray-500">
              {joinedClassrooms.length > 0
                ? `Linked to ${joinedClassrooms.length} classroom${joinedClassrooms.length > 1 ? 's' : ''}`
                : 'Join a classroom to share your progress with your teacher'}
            </p>
          </div>
        </div>
        {!showJoinForm && (
          <button
            onClick={() => setShowJoinForm(true)}
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            Join Classroom
          </button>
        )}
      </div>

      {/* Joined Classrooms List */}
      {isLoadingClassrooms ? (
        <div className="flex items-center justify-center py-8">
          <LoaderIcon className="text-blue-500" size={32} />
        </div>
      ) : joinedClassrooms.length > 0 ? (
        <div className="space-y-3 mb-6">
          {joinedClassrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <SchoolIcon className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{classroom.name}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-blue-600 font-medium">{classroom.grade_level}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">Joined as: {classroom.student_name}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  Linked
                </span>
                <button
                  onClick={() => handleLeaveClassroom(classroom.class_code, classroom.name)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Leave classroom"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !showJoinForm ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <SchoolIcon className="text-blue-400" size={32} />
          </div>
          <p className="text-gray-500 font-medium mb-1">No classrooms joined yet</p>
          <p className="text-gray-400 text-sm mb-4">Ask your teacher for a class code to get started</p>
          <button
            onClick={() => setShowJoinForm(true)}
            className="bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Enter Class Code
          </button>
        </div>
      ) : null}

      {/* Join Form */}
      {showJoinForm && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
          {step === 'input' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800 text-lg">Enter Class Code</h4>
                <button
                  onClick={resetForm}
                  className="p-1.5 hover:bg-white/60 rounded-lg transition-colors"
                >
                  <XIcon size={18} className="text-gray-400" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Your teacher will give you a 6-character code. Enter it below to join their classroom.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Class Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. ABC123"
                      value={classCode}
                      onChange={e => setClassCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-400 text-center text-2xl font-mono font-bold tracking-[0.3em] uppercase bg-white"
                      maxLength={6}
                      autoFocus
                    />
                    {classCode.length === 6 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckIcon className="text-green-500" size={20} />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    {classCode.length}/6 characters
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-center gap-2">
                    <XIcon size={16} />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleValidateCode}
                  disabled={classCode.length !== 6 || isValidating}
                  className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <LoaderIcon size={18} />
                      Checking code...
                    </>
                  ) : (
                    <>
                      <SearchIcon size={18} />
                      Find Classroom
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'confirm' && classroomInfo && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800 text-lg">Classroom Found!</h4>
                <button
                  onClick={resetForm}
                  className="p-1.5 hover:bg-white/60 rounded-lg transition-colors"
                >
                  <XIcon size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Classroom Info Card */}
              <div className="bg-white rounded-xl p-4 mb-4 border border-blue-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                    <SchoolIcon className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{classroomInfo.name}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-lg">
                        {classroomInfo.grade_level}
                      </span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <UsersIcon size={14} />
                        {classroomInfo.student_count} students
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Your Name (as shown to teacher)</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  If your teacher already added your name, we'll link your account automatically.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm flex items-center gap-2 mb-4">
                  <XIcon size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep('input'); setError(null); }}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleJoinClassroom}
                  disabled={!studentName.trim() || isJoining}
                  className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isJoining ? (
                    <>
                      <LoaderIcon size={18} />
                      Joining...
                    </>
                  ) : (
                    <>
                      <CheckIcon size={18} />
                      Join Classroom
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="text-green-600" size={32} />
              </div>
              <h4 className="font-bold text-gray-800 text-xl mb-2">You're In!</h4>
              <p className="text-gray-600 mb-2">{successMessage}</p>
              {classroomInfo && (
                <p className="text-sm text-gray-500 mb-4">
                  You've joined <span className="font-semibold text-blue-600">{classroomInfo.name}</span>.
                  Your teacher can now see your reading progress in real-time.
                </p>
              )}
              <div className="bg-green-50 rounded-xl p-4 mb-4 text-left">
                <p className="text-green-800 font-semibold text-sm mb-1">What happens now?</p>
                <ul className="text-green-700 text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckIcon size={14} className="text-green-500 flex-shrink-0" />
                    Your completed mysteries will sync to your teacher
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon size={14} className="text-green-500 flex-shrink-0" />
                    Game scores and word families are shared automatically
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon size={14} className="text-green-500 flex-shrink-0" />
                    Your reading streak is visible to your teacher
                  </li>
                </ul>
              </div>
              <button
                onClick={resetForm}
                className="bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* Info about how it works */}
      {!showJoinForm && joinedClassrooms.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 mt-4">
          <p className="text-blue-800 font-semibold text-sm mb-1">How classroom linking works</p>
          <p className="text-blue-600 text-sm">
            Your reading progress, completed mysteries, game scores, and streak data are automatically
            shared with your teacher. They can see your progress in real-time from their dashboard.
          </p>
        </div>
      )}
    </div>
  );
};
