import React from 'react';
import { PawPrintIcon, SparklesIcon, BookIcon, UsersIcon, GraduationCapIcon, ShopIcon, BadgeIcon, TreehouseIcon } from './icons/Icons';



interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleClick = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 border-t-4 border-purple-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-md">
                <PawPrintIcon className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Word and Whisker
              </span>

            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Helping young readers discover the joy of words through friendly animal detectives and gentle mysteries.
            </p>
          </div>

          {/* For Kids */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <SparklesIcon className="text-yellow-500" size={20} />
              For Kids
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleClick('mysteries')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Play Mysteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('characters')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Meet the Detectives
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('shop')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Detective Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('my-detective')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  My Detective
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('my-hq')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  My Treehouse HQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('progress')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  My Badges
                </button>
              </li>
            </ul>



          </div>

          {/* For Parents */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UsersIcon className="text-teal-500" size={20} />
              For Parents
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleClick('parentDashboard')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Progress Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('parents')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Practice Sheets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('parents')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Accessibility
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('parents')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>

          {/* For Teachers */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <GraduationCapIcon className="text-blue-500" size={20} />
              For Teachers
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleClick('teachers')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Classroom Setup
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('teachers')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Student Roster
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('teachers')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Class Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('teachers')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Progress Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookIcon className="text-amber-500" size={20} />
              Learning
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleClick('mysteries')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Ages 5-8
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('mysteries')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Kindergarten - 2nd Grade
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('progress')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Phonics & Word Families
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleClick('mysteries')}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors text-left"
                >
                  Reading Comprehension
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-purple-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              Made with love for young readers everywhere
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Safe for Kids</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400 text-sm">No Ads</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400 text-sm">Privacy First</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
