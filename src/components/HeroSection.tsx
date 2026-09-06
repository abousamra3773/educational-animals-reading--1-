import React from 'react';
import { heroImage } from '../data/gameData';
import { useLanguage } from '../context/LanguageContext';
import { TapToHear } from './TapToHear';
import { MagnifyingGlassIcon, PawPrintIcon, SparklesIcon } from './icons/Icons';

interface HeroSectionProps {
  onStartPlaying: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartPlaying }) => {
  const { t, isSpanish } = useLanguage();

  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cozy detective village"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-purple-900/60" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce" style={{ animationDuration: '3s' }}>
        <PawPrintIcon className="text-white/30" size={40} />
      </div>
      <div className="absolute top-40 right-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <SparklesIcon className="text-yellow-300/50" size={36} />
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <MagnifyingGlassIcon className="text-white/30" size={32} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Title Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-2xl transform hover:scale-[1.02] transition-transform duration-500">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <MagnifyingGlassIcon className="text-white" size={40} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-pulse">
                <PawPrintIcon className="text-white" size={16} />
              </div>
            </div>
          </div>

          {/* Title with Tap-to-Hear */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>
            <TapToHear text={`${t('hero.title')} ${t('hero.subtitle')}`} size="large" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-6">
            {t('hero.subtitle')}
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            {t('hero.description')}
          </p>

          {/* CTA Button */}
          <button
            onClick={onStartPlaying}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white text-xl font-bold px-10 py-5 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <MagnifyingGlassIcon size={28} />
            <span>{t('hero.cta')}</span>
            <SparklesIcon className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" size={24} />
          </button>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              t('hero.ages'), 
              isSpanish ? t('words.vocabAndVerbs') : t('hero.wordFamilies'), 
              t('hero.tapToHear'),
              t('hero.bilingual')
            ].map((feature) => (
              <span
                key={feature}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-2 h-3 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};
