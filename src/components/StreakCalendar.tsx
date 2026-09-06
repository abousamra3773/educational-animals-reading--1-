import React, { useState, useMemo } from 'react';
import { FlameIcon, ChevronLeftIcon, ChevronRightIcon, TrophyIcon, CalendarIcon } from './icons/Icons';

interface StreakCalendarProps {
  activeDays: string[]; // Array of date strings 'YYYY-MM-DD'
  currentStreak: number;
  longestStreak: number;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTodayString = (): string => {
  return getDateString(new Date());
};

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ activeDays, currentStreak, longestStreak }) => {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const activeDaysSet = useMemo(() => new Set(activeDays), [activeDays]);
  const todayStr = getTodayString();

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: { date: number; dateStr: string; isActive: boolean; isToday: boolean; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: day,
        dateStr,
        isActive: activeDaysSet.has(dateStr),
        isToday: dateStr === todayStr,
        isCurrentMonth: false
      });
    }

    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: day,
        dateStr,
        isActive: activeDaysSet.has(dateStr),
        isToday: dateStr === todayStr,
        isCurrentMonth: true
      });
    }

    // Next month padding
    const remainingSlots = 42 - days.length; // 6 rows x 7 days
    for (let day = 1; day <= remainingSlots; day++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: day,
        dateStr,
        isActive: activeDaysSet.has(dateStr),
        isToday: dateStr === todayStr,
        isCurrentMonth: false
      });
    }

    return days;
  }, [viewYear, viewMonth, firstDayOfMonth, daysInMonth, activeDaysSet, todayStr]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToToday = () => {
    setViewMonth(today.getMonth());
    setViewYear(today.getFullYear());
  };

  // Count active days this month
  const activeDaysThisMonth = calendarDays.filter(d => d.isCurrentMonth && d.isActive).length;

  // Determine if we can go forward
  const canGoNext = viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-5">
        <div className="flex items-center gap-3 mb-3">
          <CalendarIcon className="text-white" size={24} />
          <h3 className="text-xl font-bold text-white">Reading Calendar</h3>
        </div>

        {/* Streak stats row */}
        <div className="flex gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
            <FlameIcon className="text-white" size={20} filled />
            <div>
              <p className="text-white font-bold text-lg leading-tight">{currentStreak}</p>
              <p className="text-white/80 text-xs font-semibold">Current Streak</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
            <TrophyIcon className="text-white" size={20} />
            <div>
              <p className="text-white font-bold text-lg leading-tight">{longestStreak}</p>
              <p className="text-white/80 text-xs font-semibold">Best Streak</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
            <CalendarIcon className="text-white" size={20} />
            <div>
              <p className="text-white font-bold text-lg leading-tight">{activeDays.length}</p>
              <p className="text-white/80 text-xs font-semibold">Total Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-5">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeftIcon size={20} className="text-gray-600" />
          </button>
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-800">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h4>
            <p className="text-xs text-gray-500">
              {activeDaysThisMonth} active {activeDaysThisMonth === 1 ? 'day' : 'days'} this month
            </p>
          </div>
          <div className="flex items-center gap-1">
            {(viewMonth !== today.getMonth() || viewYear !== today.getFullYear()) && (
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                Today
              </button>
            )}
            <button
              onClick={goToNextMonth}
              disabled={!canGoNext}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="text-center text-xs font-bold text-gray-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isFutureDate = day.dateStr > todayStr;
            return (
              <div
                key={index}
                className={`
                  relative aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all
                  ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                  ${day.isCurrentMonth && !day.isActive && !isFutureDate ? 'text-gray-500' : ''}
                  ${day.isCurrentMonth && isFutureDate ? 'text-gray-300' : ''}
                  ${day.isActive && day.isCurrentMonth ? 'bg-gradient-to-br from-orange-400 to-amber-400 text-white shadow-sm' : ''}
                  ${day.isActive && !day.isCurrentMonth ? 'bg-orange-100 text-orange-400' : ''}
                  ${day.isToday && !day.isActive ? 'ring-2 ring-orange-300 text-orange-600' : ''}
                  ${day.isToday && day.isActive ? 'ring-2 ring-orange-600 ring-offset-1' : ''}
                `}
              >
                {day.date}
                {day.isActive && day.isCurrentMonth && (
                  <div className="absolute -top-0.5 -right-0.5">
                    <FlameIcon className="text-orange-300" size={10} filled />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-400 to-amber-400" />
            <span className="text-xs text-gray-500 font-semibold">Active Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded ring-2 ring-orange-300" />
            <span className="text-xs text-gray-500 font-semibold">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};
