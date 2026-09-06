import { useMemo } from 'react';
import { Mystery, StoryScene, DialogueLine } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { spanishTranslations } from '../data/storyTranslations';
import { getSpanishLearningData, SpanishLearningSet } from '../data/spanishLearningData';

export interface TranslatedMystery extends Mystery {
  // Spanish learning data (only populated when language is Spanish)
  spanishLearning?: SpanishLearningSet;
  // Whether this mystery is in Spanish learning mode
  isSpanishMode?: boolean;
}

export function useTranslatedMystery(mystery: Mystery): TranslatedMystery {
  const { language } = useLanguage();

  return useMemo(() => {
    if (language === 'en') return mystery;

    const translation = spanishTranslations[mystery.id];
    if (!translation) return mystery;

    // Build translated story pages
    const translatedStory = mystery.story.map((page, index) => {
      const translatedPage = translation.story?.[index];
      if (!translatedPage) return page;
      return {
        ...page,
        text: translatedPage.text,
        clue: translatedPage.clue || page.clue,
      };
    });

    // Build translated scenes
    let translatedScenes: StoryScene[] | undefined = mystery.scenes;
    if (mystery.scenes && translation.scenes) {
      translatedScenes = mystery.scenes.map((scene) => {
        const translatedScene = translation.scenes?.find(s => s.id === scene.id);
        if (!translatedScene) return scene;

        const translatedDialogue: DialogueLine[] = scene.dialogue.map((line, dIdx) => {
          const translatedLine = translatedScene.dialogue?.[dIdx];
          if (!translatedLine) return line;
          return {
            ...line,
            text: translatedLine.text,
          };
        });

        return {
          ...scene,
          title: translatedScene.title || scene.title,
          headerText: translatedScene.headerText || scene.headerText,
          dialogue: translatedDialogue,
          interactiveTarget: scene.interactiveTarget ? {
            ...scene.interactiveTarget,
            description: translatedScene.interactiveTarget?.description || scene.interactiveTarget.description,
            hint: translatedScene.interactiveTarget?.hint || scene.interactiveTarget.hint,
          } : undefined,
        };
      });
    }

    // Get Spanish learning data (vocabulary + verbs)
    const spanishLearning = getSpanishLearningData(mystery.id);

    return {
      ...mystery,
      title: translation.title,
      tagline: translation.tagline || mystery.tagline,
      description: translation.description,
      story: translatedStory,
      scenes: translatedScenes,
      // In Spanish mode, replace the word family concept with vocabulary/verbs
      wordFamily: spanishLearning ? 'Vocabulario' : translation.wordFamily || mystery.wordFamily,
      // In Spanish mode, use Spanish vocabulary words instead of English word family words
      words: spanishLearning ? spanishLearning.allWords : mystery.words,
      spanishLearning,
      isSpanishMode: true,
    };
  }, [mystery, language]);
}

// Hook to translate a list of mysteries (for cards/lists)
export function useTranslatedMysteries(mysteries: Mystery[]): TranslatedMystery[] {
  const { language } = useLanguage();

  return useMemo(() => {
    if (language === 'en') return mysteries;

    return mysteries.map(mystery => {
      const translation = spanishTranslations[mystery.id];
      if (!translation) return mystery;

      const spanishLearning = getSpanishLearningData(mystery.id);

      return {
        ...mystery,
        title: translation.title,
        tagline: translation.tagline || mystery.tagline,
        description: translation.description,
        wordFamily: spanishLearning ? 'Vocabulario' : translation.wordFamily || mystery.wordFamily,
        spanishLearning,
        isSpanishMode: true,
      };
    });
  }, [mysteries, language]);
}
