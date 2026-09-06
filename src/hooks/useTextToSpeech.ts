import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTextToSpeechOptions {
  speed?: number;
  speaker?: string;   // Character name for voice selection (e.g. 'narrator', 'detective', 'Jake the Snake')
  voiceId?: string;    // Direct ElevenLabs voice ID override
}

interface UseTextToSpeechReturn {
  speak: (text: string, options?: UseTextToSpeechOptions) => Promise<void>;
  speakWithHighlight: (text: string, onWordHighlight: (index: number) => void, options?: UseTextToSpeechOptions) => Promise<void>;
  isLoading: boolean;
  isPlaying: boolean;
  stop: () => void;
  error: string | null;
}

// ============================================================
// GLOBAL AUDIO MANAGER
// Ensures only ONE audio source plays at a time across the
// entire app, no matter how many useTextToSpeech instances exist.
// This prevents the "old voice bleeding through" bug where
// clicking a new microphone would overlay on a still-playing one.
// ============================================================

type StopFn = () => void;

// Module-level set of all active stop functions from every hook instance
const globalActiveStopFns = new Set<StopFn>();

// Unique counter for identifying instances
let instanceCounter = 0;

/**
 * Stop ALL currently playing audio across every useTextToSpeech instance,
 * EXCEPT the one identified by `exceptId` (the caller about to start new audio).
 */
function stopAllOtherAudio(exceptId: number) {
  globalActiveStopFns.forEach((fn) => {
    // We call every registered stop function. The caller will re-register
    // itself after starting its new audio.
    fn();
  });
  // Also kill any lingering browser speech synthesis globally
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

// ============================================================

// Count syllables in a word (approximate)
function countSyllables(word: string): number {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (cleanWord.length <= 2) return 1;
  if (cleanWord.length <= 4) return Math.max(1, Math.ceil(cleanWord.length / 2));
  
  // Count vowel groups
  const vowelGroups = cleanWord.match(/[aeiouy]+/g) || [];
  let count = vowelGroups.length;
  
  // Adjust for silent e at end
  if (cleanWord.endsWith('e') && count > 1) {
    count--;
  }
  
  // Adjust for common patterns
  if (cleanWord.endsWith('le') && cleanWord.length > 2 && !/[aeiouy]/.test(cleanWord[cleanWord.length - 3])) {
    count++;
  }
  
  return Math.max(1, count);
}

// Calculate word weight for proportional timing
function getWordWeight(word: string): number {
  const cleanWord = word.replace(/[^a-zA-Z]/g, '');
  const syllables = countSyllables(cleanWord);
  
  // Base weight from syllables (each syllable takes time)
  let weight = syllables * 1.2;
  
  // Add weight for punctuation pauses
  if (word.includes('.') || word.includes('!') || word.includes('?')) {
    weight += 1.5; // Sentence-ending pause
  } else if (word.includes(',')) {
    weight += 0.8; // Comma pause
  } else if (word.includes(':') || word.includes(';')) {
    weight += 1.0; // Colon/semicolon pause
  }
  
  // Minimum weight for very short words
  return Math.max(0.8, weight);
}

// Calculate proportional word timings based on actual audio duration
function calculateWordTimings(words: string[], audioDurationSeconds: number, playbackRate: number): number[] {
  // Calculate total weight
  const weights = words.map(getWordWeight);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  // The actual playback duration (how long it takes to play the audio)
  const playbackDurationMs = (audioDurationSeconds / playbackRate) * 1000;
  
  // Buffer at start (TTS usually has a tiny pause before speaking)
  const startBuffer = playbackDurationMs * 0.02;
  // Buffer at end
  const endBuffer = playbackDurationMs * 0.03;
  const availableDuration = playbackDurationMs - startBuffer - endBuffer;
  
  // Calculate timing for each word
  const timings: number[] = [];
  let currentTime = startBuffer;
  
  for (let i = 0; i < words.length; i++) {
    timings.push(currentTime);
    // Duration for this word based on its proportion of total weight
    const wordDuration = (weights[i] / totalWeight) * availableDuration;
    currentTime += wordDuration;
  }
  
  return timings;
}

// Browser speech voice mapping for fallback
const BROWSER_VOICE_GENDER_MAP: Record<string, 'male' | 'female'> = {
  'narrator': 'female',
  'detective': 'female',
  'jake': 'male',
  'pancake': 'female',
  'bella': 'female',
  'batty': 'male',
  'matt': 'male',
  'oliver': 'male',
  'ted': 'female',
  'piggy': 'female',
  'sheepy': 'female',
  'misty': 'female',
  'benny': 'male',
  'mabel': 'female',

  'finn': 'male',
};

function getBrowserVoiceForSpeaker(speaker?: string): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  
  // Determine preferred gender
  let preferredGender: 'male' | 'female' = 'female';
  if (speaker) {
    const speakerLower = speaker.toLowerCase();
    for (const [key, gender] of Object.entries(BROWSER_VOICE_GENDER_MAP)) {
      if (speakerLower.includes(key)) {
        preferredGender = gender;
        break;
      }
    }
  }
  
  // Try to find a matching American English voice
  const enUSVoices = voices.filter(v => v.lang === 'en-US');
  
  if (preferredGender === 'male') {
    const maleVoice = enUSVoices.find(v => 
      v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('Fred') || v.name.includes('Male')
    );
    if (maleVoice) return maleVoice;
  } else {
    const femaleVoice = enUSVoices.find(v => 
      v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Google') || v.name.includes('Female')
    );
    if (femaleVoice) return femaleVoice;
  }
  
  // Fallback to any en-US voice
  return enUSVoices[0] || voices.find(v => v.lang.startsWith('en')) || null;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const playbackRateRef = useRef<number>(0.85);
  
  // Unique ID for this hook instance
  const instanceIdRef = useRef<number>(++instanceCounter);

  const clearAnimationFrame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Internal stop that cleans up THIS instance's audio
  const stopInternal = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    clearAnimationFrame();
    setIsPlaying(false);
  }, [clearAnimationFrame]);

  // Register/unregister this instance's stop function with the global manager
  useEffect(() => {
    globalActiveStopFns.add(stopInternal);
    return () => {
      globalActiveStopFns.delete(stopInternal);
      // Clean up on unmount
      stopInternal();
    };
  }, [stopInternal]);

  // Public stop: stops this instance + cancels browser speech
  const stop = useCallback(() => {
    stopInternal();
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }, [stopInternal]);

  /**
   * Stop ALL other audio globally before this instance starts playing.
   * This is the key fix: clicking microphone B will silence microphone A's
   * still-playing audio, preventing voice overlap.
   */
  const stopAllBeforePlay = useCallback(() => {
    const myId = instanceIdRef.current;
    // Stop every registered instance (including ourselves - we'll start fresh)
    stopAllOtherAudio(myId);
  }, []);

  const fetchAudio = useCallback(async (text: string, speaker?: string, voiceId?: string): Promise<Blob | null> => {
    const supabaseUrl = 'https://byzvtyjvlzvzfifmhbsd.databasepad.com';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijk3ZTcyMDdjLWQxNDYtNDAxYy1iZjI4LTgwNWM1N2IzY2I4NiJ9.eyJwcm9qZWN0SWQiOiJieXp2dHlqdmx6dnpmaWZtaGJzZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NDM3MTE0LCJleHAiOjIwODQ3OTcxMTQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.uAJhoeCRuWfZb13Ah9v_MlW3oBxqMIon9EG0fPFoVCQ';
    
    const body: Record<string, string> = { text };
    if (voiceId) body.voiceId = voiceId;
    if (speaker) body.speaker = speaker;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBlob = await response.blob();
    return audioBlob && audioBlob.size > 0 ? audioBlob : null;
  }, []);

  const speak = useCallback(async (text: string, options?: UseTextToSpeechOptions) => {
    if (!text.trim()) return;
    
    const playbackRate = options?.speed ?? 0.85;
    playbackRateRef.current = playbackRate;
    
    // CRITICAL: Stop ALL audio globally before starting new audio
    stopAllBeforePlay();
    
    setIsLoading(true);
    setError(null);

    try {
      const audioBlob = await fetchAudio(text, options?.speaker, options?.voiceId);
      
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioUrlRef.current = audioUrl;
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.playbackRate = playbackRate;
        
        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          audioUrlRef.current = null;
        };
        audio.onerror = () => {
          setError('Failed to play audio');
          setIsPlaying(false);
          useBrowserSpeech(text, playbackRate, options?.speaker);
        };
        
        await audio.play();
      } else {
        useBrowserSpeech(text, playbackRate, options?.speaker);
      }
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
      useBrowserSpeech(text, options?.speed ?? 0.85, options?.speaker);
    } finally {
      setIsLoading(false);
    }
    
    function useBrowserSpeech(text: string, rate: number, speaker?: string) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = Math.max(0.5, rate);
        utterance.pitch = 1.0;
        
        const voice = getBrowserVoiceForSpeaker(speaker);
        if (voice) utterance.voice = voice;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
      }
    }
  }, [stopAllBeforePlay, fetchAudio]);

  const speakWithHighlight = useCallback(async (
    text: string, 
    onWordHighlight: (index: number) => void,
    options?: UseTextToSpeechOptions
  ) => {
    if (!text.trim()) return;
    
    const playbackRate = options?.speed ?? 0.85;
    playbackRateRef.current = playbackRate;
    
    // CRITICAL: Stop ALL audio globally before starting new audio
    // This prevents the "old voice" from bleeding through when clicking
    // a different character's microphone
    stopAllBeforePlay();
    
    setIsLoading(true);
    setError(null);

    const words = text.split(' ');

    try {
      const audioBlob = await fetchAudio(text, options?.speaker, options?.voiceId);
      
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioUrlRef.current = audioUrl;
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.playbackRate = playbackRate;
        
        // Wait for audio metadata to load to get duration
        await new Promise<void>((resolve, reject) => {
          audio.onloadedmetadata = () => resolve();
          audio.onerror = () => reject(new Error('Failed to load audio'));
          audio.load();
        });
        
        const audioDuration = audio.duration;
        const wordTimings = calculateWordTimings(words, audioDuration, playbackRate);
        
        let lastHighlightedIndex = -1;
        
        const updateHighlight = () => {
          if (!audioRef.current || audioRef.current.paused || audioRef.current.ended) {
            return;
          }
          
          const currentTimeMs = (audioRef.current.currentTime / playbackRate) * 1000;
          
          let currentWordIndex = 0;
          for (let i = wordTimings.length - 1; i >= 0; i--) {
            if (currentTimeMs >= wordTimings[i]) {
              currentWordIndex = i;
              break;
            }
          }
          
          if (currentWordIndex !== lastHighlightedIndex) {
            lastHighlightedIndex = currentWordIndex;
            onWordHighlight(currentWordIndex);
          }
          
          animationFrameRef.current = requestAnimationFrame(updateHighlight);
        };
        
        audio.onplay = () => {
          setIsPlaying(true);
          onWordHighlight(0);
          lastHighlightedIndex = 0;
          animationFrameRef.current = requestAnimationFrame(updateHighlight);
        };
        
        audio.onended = () => {
          setIsPlaying(false);
          onWordHighlight(-1);
          URL.revokeObjectURL(audioUrl);
          audioUrlRef.current = null;
          clearAnimationFrame();
        };
        
        audio.onpause = () => {
          clearAnimationFrame();
        };
        
        audio.onerror = () => {
          setError('Failed to play audio');
          setIsPlaying(false);
          clearAnimationFrame();
          useBrowserSpeechWithHighlight(text, words, onWordHighlight, playbackRate, options?.speaker);
        };
        
        setIsLoading(false);
        await audio.play();
      } else {
        setIsLoading(false);
        useBrowserSpeechWithHighlight(text, words, onWordHighlight, playbackRate, options?.speaker);
      }
    } catch (err) {
      console.error('Text-to-speech error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
      setIsLoading(false);
      useBrowserSpeechWithHighlight(text, words, onWordHighlight, playbackRate, options?.speaker);
    }
    
    function useBrowserSpeechWithHighlight(
      text: string, 
      words: string[], 
      onWordHighlight: (index: number) => void,
      rate: number,
      speaker?: string
    ) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = Math.max(0.5, rate);
        utterance.pitch = 1.0;
        
        const voice = getBrowserVoiceForSpeaker(speaker);
        if (voice) utterance.voice = voice;
        
        let currentWordIndex = 0;
        
        utterance.onstart = () => {
          setIsPlaying(true);
          onWordHighlight(0);
        };
        
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            currentWordIndex++;
            if (currentWordIndex < words.length) {
              onWordHighlight(currentWordIndex);
            }
          }
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
          onWordHighlight(-1);
        };
        
        speechSynthesis.speak(utterance);
      }
    }
  }, [stopAllBeforePlay, clearAnimationFrame, fetchAudio]);

  return { speak, speakWithHighlight, isLoading, isPlaying, stop, error };
}
