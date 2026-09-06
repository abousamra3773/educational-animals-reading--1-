import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { XIcon, PawPrintIcon, SparklesIcon, CloudIcon, CheckIcon } from './icons/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { signIn, signUp } = useAuth();
  const { loadFromCloud, syncWithCloud, progress } = useGame();
  const [mode, setMode] = useState<'signin' | 'signup' | 'signup-parent'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const hasLocalProgress = progress.completedMysteries.length > 0 || progress.totalStars > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const result = await signIn(email, password);
        if (result.success) {
          if (hasLocalProgress) {
            await loadFromCloud();
          } else {
            await loadFromCloud();
          }
          onClose();
        } else {
          setError(result.error || 'Sign in failed');
        }
      } else {
        const role = mode === 'signup-parent' ? 'parent' : 'child';
        const result = await signUp(email, password, displayName, role);
        if (result.success) {
          if (hasLocalProgress) {
            await syncWithCloud();
          }
          onClose();
        } else {
          setError(result.error || 'Sign up failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full my-auto max-h-[95vh] overflow-y-auto">
        {/* Header - More compact */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-5 relative sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white p-1.5 sm:p-2 rounded-full transition-colors"
          >
            <XIcon size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <PawPrintIcon className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {mode === 'signin' ? 'Welcome Back!' : 'Join the Adventure!'}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm">
                {mode === 'signin' 
                  ? 'Sign in to continue your journey' 
                  : mode === 'signup-parent'
                    ? 'Create a parent account'
                    : 'Create your detective account'}
              </p>
            </div>
          </div>
        </div>

        {/* Cloud Sync Info - Compact */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 flex items-center gap-2 border-b border-gray-100">
          <CloudIcon className="text-blue-500 flex-shrink-0" size={16} />
          <p className="text-xs text-gray-600">
            {mode === 'signin' 
              ? 'Progress synced from cloud'
              : 'Progress saved to cloud'}
          </p>
        </div>

        {/* Form - More compact spacing */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm">
              {error}
            </div>
          )}

          {mode !== 'signin' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {mode === 'signup-parent' ? 'Your Name' : 'Detective Name'}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={mode === 'signup-parent' ? 'Enter your name' : 'Enter your detective name'}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
              required
              minLength={6}
            />
            {mode !== 'signin' && (
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <SparklesIcon size={18} />
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Benefits Section - Collapsible/Compact */}
        <div className="px-4 sm:px-5 pb-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <h4 className="font-semibold text-gray-700 mb-2 text-xs">Why create an account?</h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                  <CheckIcon size={10} />
                </span>
                <span>Save progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                  <CheckIcon size={10} />
                </span>
                <span>Keep badges</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                  <CheckIcon size={10} />
                </span>
                <span>Track scores</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                  <CheckIcon size={10} />
                </span>
                <span>Any device</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="px-4 sm:px-5 pb-4 space-y-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500">or</span>
            </div>
          </div>

          {mode === 'signin' ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setMode('signup'); resetForm(); }}
                className="flex-1 bg-purple-50 text-purple-700 font-semibold py-2.5 rounded-xl hover:bg-purple-100 transition-colors text-sm"
              >
                Child Account
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup-parent'); resetForm(); }}
                className="flex-1 bg-teal-50 text-teal-700 font-semibold py-2.5 rounded-xl hover:bg-teal-100 transition-colors text-sm"
              >
                Parent Account
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setMode('signin'); resetForm(); }}
              className="w-full bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm"
            >
              Already have an account? Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
