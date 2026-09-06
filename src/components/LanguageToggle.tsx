import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../context/LanguageContext';

interface LanguageToggleProps {
  compact?: boolean;
}

const languages: { code: Language; label: string; flag: string; nativeName: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
];

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-xl transition-all duration-200
          ${compact 
            ? 'px-2.5 py-2 bg-purple-50 hover:bg-purple-100' 
            : 'px-3 py-2 bg-purple-50 hover:bg-purple-100'
          }
        `}
        title={`Language: ${currentLang.label}`}
        aria-label="Change language"
      >
        {/* Globe icon */}
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        {!compact && (
          <span className="font-semibold text-sm text-purple-700">
            {currentLang.nativeName}
          </span>
        )}
        <svg className={`w-3.5 h-3.5 text-purple-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-52 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {language === 'es' ? 'Idioma' : 'Language'}
            </p>
          </div>
          
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`
                w-full px-4 py-3 text-left flex items-center gap-3 transition-colors
                ${language === lang.code 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{lang.nativeName}</p>
                <p className="text-xs text-gray-400">{lang.label}</p>
              </div>
              {language === lang.code && (
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}

          <div className="px-4 py-2 border-t border-gray-100 mt-1">
            <p className="text-xs text-gray-400 text-center">
              {language === 'es' 
                ? 'Las historias se mostrarán en español' 
                : 'Stories will be shown in the selected language'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
