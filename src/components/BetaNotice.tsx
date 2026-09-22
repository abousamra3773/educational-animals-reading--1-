import React, { useEffect, useState } from 'react';
import { XIcon, SparklesIcon, MailIcon, ChevronDownIcon, ChevronUpIcon } from './icons/Icons';

const STORAGE_KEY = 'ww_beta_notice_dismissed';

export const BetaNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) !== '1') {
        setVisible(true);
      }
    } catch {
      // If sessionStorage is unavailable, show the notice for this render.
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Ignore storage errors; still hide for this session.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-2xl px-3"
    >
      <div className="relative bg-white/95 backdrop-blur-sm border border-purple-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500" />
        <div className="p-4 pr-10">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-sm">
              <SparklesIcon className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-bold text-purple-700 mb-0.5">
                We&apos;re in beta!
              </p>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                This site is in beta and we&apos;re actively adding more stories! Dive into our
                detective mysteries and start reading today.
              </p>

              {expanded && (
                <div className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed space-y-2">
                  <p>
                    We&apos;d love your feedback: email{' '}
                    <a
                      href="mailto:mireandmuse@outlook.com"
                      className="inline-flex items-center gap-1 font-semibold text-purple-600 hover:text-purple-800 underline decoration-purple-300 underline-offset-2"
                    >
                      <MailIcon size={14} />
                      mireandmuse@outlook.com
                    </a>{' '}
                    or visit{' '}
                    <a
                      href="https://mireandmuse.com/#contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-purple-600 hover:text-purple-800 underline decoration-purple-300 underline-offset-2"
                    >
                      mireandmuse.com/#contact
                    </a>
                    .
                  </p>
                  <p>
                    Looking for printable worksheets and activities to go with the stories? Check
                    out our{' '}
                    <a
                      href="https://www.teacherspayteachers.com/store/amy-littlefield-bousamra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-amber-600 hover:text-amber-800 underline decoration-amber-300 underline-offset-2"
                    >
                      Teachers Pay Teachers store
                    </a>
                    .
                  </p>
                </div>
              )}

              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-purple-600 hover:text-purple-800"
                aria-expanded={expanded}
              >
                {expanded ? (
                  <>
                    Show less <ChevronUpIcon size={16} />
                  </>
                ) : (
                  <>
                    Read more, feedback &amp; worksheets <ChevronDownIcon size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={dismiss}
          aria-label="Dismiss beta notice"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-purple-500 hover:text-purple-700 hover:bg-purple-100 transition-colors"
        >
          <XIcon size={18} />
        </button>
      </div>
    </div>
  );
};
