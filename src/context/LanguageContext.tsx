import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isSpanish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'wordWhiskerLanguage';

// UI translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.mysteries': 'Mysteries',
    'nav.detectives': 'Detectives',
    'nav.progress': 'My Progress',
    'nav.parents': 'Parents',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    'nav.syncStatus': 'Cloud Sync',
    'nav.syncing': 'Syncing...',
    'nav.synced': 'Synced',
    'nav.syncError': 'Sync Error',
    'nav.syncNow': 'Sync Now',
    'nav.manageChildren': 'Manage Children',
    
    // Hero Section
    'hero.title': 'Word and Whisker',

    'hero.subtitle': 'Detectives',
    'hero.description': 'Join our friendly animal detectives on exciting reading adventures! Solve gentle mysteries by discovering word families and reading clues.',
    'hero.cta': 'Start Solving Mysteries!',
    'hero.ages': 'Ages 5-8',
    'hero.wordFamilies': 'Word Families',
    'hero.tapToHear': 'Tap to Hear',
    'hero.bilingual': 'Bilingual',
    
    // Mystery Cards
    'mystery.easy': 'Easy',
    'mystery.medium': 'Medium',
    'mystery.hard': 'Tricky',
    'mystery.playAgain': 'Play Again',
    'mystery.startCase': 'Start Case',
    'mystery.with': 'with',
    'mystery.wordFamily': 'Word Family',
    
    // Reading Interface
    'reading.exit': 'Exit',
    'reading.page': 'Page',
    'reading.of': 'of',
    'reading.scene': 'Scene',
    'reading.continue': 'Continue',
    'reading.completeStory': 'Complete Story!',
    'reading.solveMystery': 'Solve Mystery!',
    'reading.next': 'Next',
    'reading.back': 'Back',
    'reading.detectiveClue': 'Detective Clue:',
    'reading.recordReading': 'Record Your Reading',
    'reading.practiceReading': 'Practice reading out loud!',
    'reading.recordingSaved': 'Recording saved!',
    'reading.readSceneAloud': 'Read Scene Aloud',
    'reading.stop': 'Stop',
    'reading.loadingStory': 'Loading story...',
    'reading.narrator': 'Narrator',
    
    // Vocabulary (Spanish mode)
    'vocab.titleSpanish': "Let's Learn Spanish Words!",
    'vocab.descriptionSpanish': "Before we start the story, let's learn some Spanish vocabulary and verbs!",
    'vocab.vocabulario': 'Vocabulary',
    'vocab.verbos': 'Verbs',
    'vocab.spanishWord': 'Spanish',
    'vocab.englishWord': 'English',
    'vocab.infinitive': 'Infinitive',
    'vocab.conjugation': 'He/She form',
    'vocab.example': 'Example',
    'vocab.tapToHearSpanish': 'Tap to hear in Spanish',
    'vocab.learnTheseWords': 'Learn these words from the story:',
    'vocab.learnTheseVerbs': 'Learn these action words:',
    
    // Word Family
    'words.inFamily': 'Words in the',
    'words.family': 'family:',
    'words.tapEachWord': 'Each word has its own microphone! Tap to hear any word you need help with.',
    'words.found': 'You found',
    'words.ofWords': 'of',
    'words.words': 'words!',
    'words.vocabAndVerbs': 'Vocabulary & Verbs',
    
    // Celebration
    'celebration.mysterySolved': 'Mystery Solved!',
    'celebration.greatWork': 'Great detective work,',
    'celebration.coinsEarned': '+10 coins earned!',
    'celebration.playGames': "Now let's play some learning games!",
    
    // Interactive scenes
    'interactive.youFoundIt': 'You found it!',
    'interactive.tapSentence': 'Tap the microphone to hear the sentence read aloud with word highlighting!',
    
    // Streak
    'streak.dayStreak': 'day streak!',
    'streak.startStreak': 'Start your streak!',
    
    // Language
    'lang.switch': 'Español',
    'lang.current': 'English',
    'lang.label': 'Language',

  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.mysteries': 'Misterios',
    'nav.detectives': 'Detectives',
    'nav.progress': 'Mi Progreso',
    'nav.parents': 'Padres',
    'nav.signIn': 'Iniciar Sesión',
    'nav.signOut': 'Cerrar Sesión',
    'nav.syncStatus': 'Sincronización',
    'nav.syncing': 'Sincronizando...',
    'nav.synced': 'Sincronizado',
    'nav.syncError': 'Error de Sync',
    'nav.syncNow': 'Sincronizar Ahora',
    'nav.manageChildren': 'Administrar Niños',
    
    // Hero Section
    'hero.title': 'Palabra y Bigote',
    'hero.subtitle': 'Detectives',

    'hero.description': '¡Únete a nuestros simpáticos detectives animales en emocionantes aventuras de lectura! Resuelve misterios descubriendo familias de palabras y leyendo pistas.',
    'hero.cta': '¡Empieza a Resolver Misterios!',
    'hero.ages': 'Edades 5-8',
    'hero.wordFamilies': 'Familias de Palabras',
    'hero.tapToHear': 'Toca para Escuchar',
    'hero.bilingual': 'Bilingüe',
    
    // Mystery Cards
    'mystery.easy': 'Fácil',
    'mystery.medium': 'Medio',
    'mystery.hard': 'Difícil',
    'mystery.playAgain': 'Jugar de Nuevo',
    'mystery.startCase': 'Empezar Caso',
    'mystery.with': 'con',
    'mystery.wordFamily': 'Familia de Palabras',
    
    // Reading Interface
    'reading.exit': 'Salir',
    'reading.page': 'Página',
    'reading.of': 'de',
    'reading.scene': 'Escena',
    'reading.continue': 'Continuar',
    'reading.completeStory': '¡Completar Historia!',
    'reading.solveMystery': '¡Resolver Misterio!',
    'reading.next': 'Siguiente',
    'reading.back': 'Atrás',
    'reading.detectiveClue': 'Pista del Detective:',
    'reading.recordReading': 'Graba tu Lectura',
    'reading.practiceReading': '¡Practica leyendo en voz alta!',
    'reading.recordingSaved': '¡Grabación guardada!',
    'reading.readSceneAloud': 'Leer Escena en Voz Alta',
    'reading.stop': 'Parar',
    'reading.loadingStory': 'Cargando historia...',
    'reading.narrator': 'Narrador',
    // Vocabulary (Spanish mode)
    'vocab.title': '¡Aprendamos Español!',
    'vocab.titleSpanish': '¡Aprendamos Palabras en Español!',
    'vocab.description': 'Antes de empezar la historia, ¡aprendamos vocabulario y verbos en español!',
    'vocab.descriptionSpanish': 'Antes de empezar, ¡aprendamos palabras y verbos nuevos!',
    'vocab.descriptionEnd': '¡Toca cada palabra para escuchar cómo suena!',
    'vocab.detectiveSays': '"¡Hola! Soy {name}. ¡Aprendamos estas palabras juntos! Toca el micrófono en cada palabra para escucharme decirla."',
    'vocab.allWordsEnd': 'Todas estas palabras terminan con:',
    'vocab.tapToHear': 'Toca para escuchar',
    'vocab.wordsPracticed': 'Palabras practicadas:',
    'vocab.startStory': '¡Empezar la Historia!',
    'vocab.tapWordsHint': '¡Siempre puedes tocar las palabras en la historia para escucharlas de nuevo!',
    'vocab.vocabulario': 'Vocabulario',
    'vocab.verbos': 'Verbos',
    'vocab.spanishWord': 'Español',
    'vocab.englishWord': 'Inglés',
    'vocab.infinitive': 'Infinitivo',
    'vocab.conjugation': 'Forma él/ella',
    'vocab.example': 'Ejemplo',
    'vocab.tapToHearSpanish': 'Toca para escuchar en español',
    'vocab.learnTheseWords': 'Aprende estas palabras del cuento:',
    'vocab.learnTheseVerbs': 'Aprende estos verbos de acción:',
    'words.vocabAndVerbs': 'Vocabulario y Verbos',
    
    // Word Family
    'words.inFamily': 'Palabras de la familia',
    'words.family': ':',
    'words.tapEachWord': '¡Cada palabra tiene su propio micrófono! Toca para escuchar cualquier palabra.',
    'words.found': 'Encontraste',
    'words.ofWords': 'de',
    'words.words': '¡palabras!',

    // Celebration
    'celebration.mysterySolved': '¡Misterio Resuelto!',
    'celebration.greatWork': '¡Gran trabajo de detective,',
    'celebration.coinsEarned': '¡+10 monedas ganadas!',
    'celebration.playGames': '¡Ahora juguemos algunos juegos de aprendizaje!',
    
    // Interactive scenes
    'interactive.youFoundIt': '¡Lo encontraste!',
    'interactive.tapSentence': '¡Toca el micrófono para escuchar la oración leída en voz alta!',
    
    // Streak
    'streak.dayStreak': '¡días de racha!',
    'streak.startStreak': '¡Empieza tu racha!',
    
    // Language
    'lang.switch': 'English',
    'lang.current': 'Español',
    'lang.label': 'Idioma',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === 'es' ? 'es' : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      isSpanish: language === 'es'
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
