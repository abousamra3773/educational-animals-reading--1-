import React, { useState, useRef, useEffect } from 'react';
import { useVoiceRecorder, saveRecording, formatDuration } from '../hooks/useVoiceRecorder';
import { VoiceRecording } from '../types';
import { 
  MicrophoneIcon, 
  StopIcon, 
  PlayIcon, 
  PauseIcon, 
  CheckIcon,
  XIcon,
  WaveformIcon
} from './icons/Icons';

interface VoiceRecorderProps {
  mysteryId: string;
  mysteryTitle: string;
  pageNumber: number;
  pageText: string;
  childName?: string;
  onRecordingSaved?: (recording: VoiceRecording) => void;
  compact?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  mysteryId,
  mysteryTitle,
  pageNumber,
  pageText,
  childName,
  onRecordingSaved,
  compact = false
}) => {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioLevel,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    error,
    isSupported
  } = useVoiceRecorder();

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup audio URL on unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleStartRecording = async () => {
    setRecordedBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    await startRecording();
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      setRecordedBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setShowSaveConfirm(true);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSaveRecording = async () => {
    if (!recordedBlob) return;
    
    setIsSaving(true);
    try {
      const recording: VoiceRecording = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        mysteryId,
        mysteryTitle,
        pageNumber,
        pageText: pageText.substring(0, 200), // Truncate for storage
        audioBlob: recordedBlob,
        duration: recordingTime,
        recordedAt: new Date().toISOString(),
        isFavorite: false,
        childName
      };
      
      await saveRecording(recording);
      onRecordingSaved?.(recording);
      
      // Reset state
      setRecordedBlob(null);
      setShowSaveConfirm(false);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    } catch (err) {
      console.error('Error saving recording:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardRecording = () => {
    setRecordedBlob(null);
    setShowSaveConfirm(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  if (!isSupported) {
    return (
      <div className={`bg-gray-100 rounded-xl p-3 text-center text-gray-500 ${compact ? 'text-sm' : ''}`}>
        Voice recording is not supported in this browser
      </div>
    );
  }

  // Compact mode for inline use
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {!isRecording && !showSaveConfirm && (
          <button
            onClick={handleStartRecording}
            className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors font-semibold text-sm"
          >
            <MicrophoneIcon size={16} />
            Record
          </button>
        )}

        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-xl">
              <div 
                className="w-2 h-2 rounded-full bg-white animate-pulse"
                style={{ opacity: 0.5 + audioLevel * 0.5 }}
              />
              <span className="font-mono text-sm">{formatDuration(recordingTime)}</span>
            </div>
            {isPaused ? (
              <button
                onClick={resumeRecording}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <PlayIcon size={14} />
              </button>
            ) : (
              <button
                onClick={pauseRecording}
                className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <PauseIcon size={14} />
              </button>
            )}
            <button
              onClick={handleStopRecording}
              className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <StopIcon size={14} />
            </button>
          </div>
        )}

        {showSaveConfirm && audioUrl && (
          <div className="flex items-center gap-2">
            <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} />
            <button
              onClick={handlePlayPause}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            </button>
            <button
              onClick={handleSaveRecording}
              disabled={isSaving}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <CheckIcon size={14} />
            </button>
            <button
              onClick={handleDiscardRecording}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <XIcon size={14} />
            </button>
          </div>
        )}

        {error && (
          <span className="text-red-500 text-xs">{error}</span>
        )}
      </div>
    );
  }

  // Full mode
  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
          <MicrophoneIcon className="text-white" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Record Your Reading</h3>
          <p className="text-sm text-gray-600">Read the story out loud!</p>
        </div>
      </div>

      {/* Recording visualization */}
      {isRecording && (
        <div className="mb-4">
          <div className="flex items-center justify-center gap-1 h-16 bg-white rounded-xl p-4">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-red-400 rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(8, Math.random() * audioLevel * 100)}%`,
                  opacity: isPaused ? 0.3 : 1
                }}
              />
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="font-mono text-2xl font-bold text-red-600">
              {formatDuration(recordingTime)}
            </span>
            {isPaused && (
              <span className="ml-2 text-yellow-600 font-semibold">(Paused)</span>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRecording && !showSaveConfirm && (
          <button
            onClick={handleStartRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
          >
            <MicrophoneIcon size={24} />
            Start Recording
          </button>
        )}

        {isRecording && (
          <>
            {isPaused ? (
              <button
                onClick={resumeRecording}
                className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold shadow-lg"
              >
                <PlayIcon size={20} />
                Resume
              </button>
            ) : (
              <button
                onClick={pauseRecording}
                className="flex items-center gap-2 px-5 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-bold shadow-lg"
              >
                <PauseIcon size={20} />
                Pause
              </button>
            )}
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-2 px-5 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors font-bold shadow-lg"
            >
              <StopIcon size={20} />
              Stop
            </button>
          </>
        )}
      </div>

      {/* Save confirmation */}
      {showSaveConfirm && audioUrl && (
        <div className="mt-4 bg-white rounded-xl p-4 border-2 border-green-200">
          <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
              >
                {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
              </button>
              <div>
                <p className="font-semibold text-gray-800">Recording Complete!</p>
                <p className="text-sm text-gray-500">Duration: {formatDuration(recordingTime)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveRecording}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-bold disabled:opacity-50"
            >
              <CheckIcon size={20} />
              {isSaving ? 'Saving...' : 'Save Recording'}
            </button>
            <button
              onClick={handleDiscardRecording}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors font-bold"
            >
              <XIcon size={20} />
              Discard
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-xl text-center">
          {error}
        </div>
      )}

      <p className="text-center text-sm text-gray-500 mt-4">
        Your recordings are saved locally and can be reviewed by parents!
      </p>
    </div>
  );
};
