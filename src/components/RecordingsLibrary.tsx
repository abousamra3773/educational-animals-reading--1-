import React, { useState, useEffect, useRef } from 'react';
import { VoiceRecording } from '../types';
import { 
  getRecordings, 
  deleteRecording, 
  toggleFavorite, 
  formatDuration 
} from '../hooks/useVoiceRecorder';
import {
  PlayIcon,
  PauseIcon,
  TrashIcon,
  HeartIcon,
  MicrophoneIcon,
  WaveformIcon,
  SearchIcon,
  CalendarIcon,
  BookIcon,
  XIcon
} from './icons/Icons';

interface RecordingsLibraryProps {
  onClose?: () => void;
  embedded?: boolean;
}

export const RecordingsLibrary: React.FC<RecordingsLibraryProps> = ({ 
  onClose,
  embedded = false 
}) => {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'story'>('date');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRecordings();
    return () => {
      // Cleanup audio URLs
      Object.values(audioUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const loadRecordings = async () => {
    try {
      setLoading(true);
      const recs = await getRecordings();
      setRecordings(recs);
      
      // Create URLs for audio playback
      const urls: Record<string, string> = {};
      recs.forEach(rec => {
        urls[rec.id] = URL.createObjectURL(rec.audioBlob);
      });
      setAudioUrls(urls);
    } catch (err) {
      console.error('Error loading recordings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (id: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrls[id];
        audioRef.current.play();
        setPlayingId(id);
      }
    }
  };

  const handleAudioEnded = () => {
    setPlayingId(null);
  };

  const handleToggleFavorite = async (id: string) => {
    await toggleFavorite(id);
    setRecordings(prev => 
      prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r)
    );
  };

  const handleDelete = async (id: string) => {
    await deleteRecording(id);
    if (audioUrls[id]) {
      URL.revokeObjectURL(audioUrls[id]);
    }
    setRecordings(prev => prev.filter(r => r.id !== id));
    setAudioUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[id];
      return newUrls;
    });
    setConfirmDelete(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Filter and sort recordings
  const filteredRecordings = recordings
    .filter(r => {
      if (filter === 'favorites' && !r.isFavorite) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          r.mysteryTitle.toLowerCase().includes(search) ||
          r.pageText.toLowerCase().includes(search) ||
          (r.childName && r.childName.toLowerCase().includes(search))
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'story':
          return a.mysteryTitle.localeCompare(b.mysteryTitle);
        default:
          return 0;
      }
    });

  const content = (
    <div className={embedded ? '' : 'p-6'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <WaveformIcon className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Voice Recordings</h2>
            <p className="text-sm text-gray-500">
              {recordings.length} recording{recordings.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>
        {!embedded && onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <XIcon size={20} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search recordings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
              filter === 'all' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
              filter === 'favorites' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <HeartIcon size={16} filled={filter === 'favorites'} />
            Favorites
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'duration' | 'story')}
          className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-white"
        >
          <option value="date">Sort by Date</option>
          <option value="duration">Sort by Duration</option>
          <option value="story">Sort by Story</option>
        </select>
      </div>

      {/* Audio element for playback */}
      <audio ref={audioRef} onEnded={handleAudioEnded} />

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading recordings...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && recordings.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <MicrophoneIcon size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recordings Yet</h3>
          <p className="text-gray-500">
            When your child records themselves reading, their recordings will appear here.
          </p>
        </div>
      )}

      {/* No results */}
      {!loading && recordings.length > 0 && filteredRecordings.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <SearchIcon size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Matching Recordings</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Recordings list */}
      {!loading && filteredRecordings.length > 0 && (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {filteredRecordings.map((recording) => (
            <div
              key={recording.id}
              className={`bg-white border-2 rounded-2xl p-4 transition-all ${
                playingId === recording.id 
                  ? 'border-purple-400 shadow-lg' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Play button */}
                <button
                  onClick={() => handlePlay(recording.id)}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    playingId === recording.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  }`}
                >
                  {playingId === recording.id ? (
                    <PauseIcon size={24} />
                  ) : (
                    <PlayIcon size={24} />
                  )}
                </button>

                {/* Recording info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <BookIcon size={16} className="text-purple-500" />
                        {recording.mysteryTitle}
                        {recording.isFavorite && (
                          <HeartIcon size={16} className="text-pink-500" filled />
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Page {recording.pageNumber} • {formatDuration(recording.duration)}
                        {recording.childName && ` • ${recording.childName}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleFavorite(recording.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          recording.isFavorite
                            ? 'text-pink-500 hover:bg-pink-50'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-pink-500'
                        }`}
                        title={recording.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <HeartIcon size={20} filled={recording.isFavorite} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(recording.id)}
                        className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Delete recording"
                      >
                        <TrashIcon size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    "{recording.pageText}..."
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <CalendarIcon size={12} />
                    {formatDate(recording.recordedAt)}
                  </div>
                </div>
              </div>

              {/* Playing indicator */}
              {playingId === recording.id && (
                <div className="mt-3 flex items-center gap-1 justify-center">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-purple-400 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 16 + 8}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Recording?</h3>
            <p className="text-gray-600 mb-6">
              This recording will be permanently deleted. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary stats */}
      {!loading && recordings.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{recordings.length}</p>
            <p className="text-sm text-purple-500">Total Recordings</p>
          </div>
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-pink-600">
              {recordings.filter(r => r.isFavorite).length}
            </p>
            <p className="text-sm text-pink-500">Favorites</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatDuration(recordings.reduce((sum, r) => sum + r.duration, 0))}
            </p>
            <p className="text-sm text-blue-500">Total Time</p>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {content}
      </div>
    </div>
  );
};
