import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  Calculator, 
  Wallet, 
  BookOpen,
  Trophy,
  Sparkles,
  Timer
} from 'lucide-react';
import { UserProfile } from '../types';

export type TabType = 'dashboard' | 'tasks' | 'pomodoro' | 'calendar' | 'grades' | 'finance' | 'subjects' | 'achievements';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  urgentTaskCount: number;
  currentUser: UserProfile;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  urgentTaskCount,
  currentUser,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Inicio',
      icon: LayoutDashboard,
      badge: urgentTaskCount > 0 ? `${urgentTaskCount}` : null,
      badgeColor: 'bg-rose-500 text-white',
      color: 'hover:text-pink-400',
      activeGradient: currentUser.id === 'anna' 
        ? 'from-red-600 to-rose-700 text-white shadow-red-600/30' 
        : currentUser.id === 'sun'
        ? 'from-cyan-500 to-blue-600 text-white shadow-cyan-500/30'
        : 'from-pink-500 to-rose-500 text-white shadow-pink-500/25',
    },
    {
      id: 'tasks' as TabType,
      label: 'Tareas & Entregas',
      icon: CheckSquare,
      badge: urgentTaskCount > 0 ? `${urgentTaskCount} urgentes` : null,
      badgeColor: 'bg-amber-500 text-white animate-pulse',
      color: 'hover:text-purple-400',
      activeGradient: currentUser.id === 'anna'
        ? 'from-red-700 to-rose-800 text-white shadow-red-600/30'
        : currentUser.id === 'sun'
        ? 'from-teal-500 to-cyan-600 text-white shadow-teal-500/30'
        : 'from-purple-600 to-indigo-600 text-white shadow-purple-500/25',
    },
    {
      id: 'pomodoro' as TabType,
      label: 'Temporizador Pomodoro',
      icon: Timer,
      color: 'hover:text-rose-400',
      activeGradient: currentUser.id === 'anna'
        ? 'from-red-600 to-rose-700 text-white shadow-red-600/30'
        : currentUser.id === 'sun'
        ? 'from-cyan-500 to-teal-600 text-white shadow-cyan-500/30'
        : 'from-pink-500 to-rose-600 text-white shadow-pink-500/25',
    },
    {
      id: 'calendar' as TabType,
      label: 'Calendario & Salidas',
      icon: CalendarDays,
      color: 'hover:text-cyan-400',
      activeGradient: currentUser.id === 'anna'
        ? 'from-rose-600 to-red-700 text-white shadow-rose-600/30'
        : currentUser.id === 'sun'
        ? 'from-cyan-500 to-blue-600 text-white shadow-cyan-500/30'
        : 'from-cyan-500 to-blue-600 text-white shadow-cyan-500/25',
    },
    {
      id: 'grades' as TabType,
      label: 'Notas & Calculadora',
      icon: Calculator,
      color: 'hover:text-emerald-400',
      activeGradient: 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/25',
    },
    {
      id: 'finance' as TabType,
      label: 'Finanzas & Metas',
      icon: Wallet,
      color: 'hover:text-amber-400',
      activeGradient: 'from-amber-500 to-orange-500 text-white shadow-amber-500/25',
    },
    {
      id: 'subjects' as TabType,
      label: 'Mis Materias',
      icon: BookOpen,
      color: 'hover:text-violet-400',
      activeGradient: currentUser.id === 'anna'
        ? 'from-red-600 to-rose-700 text-white shadow-red-600/30'
        : currentUser.id === 'sun'
        ? 'from-blue-500 to-cyan-600 text-white shadow-blue-500/30'
        : 'from-violet-500 to-fuchsia-600 text-white shadow-violet-500/25',
    },
    {
      id: 'achievements' as TabType,
      label: '🏆 Liga de Logros',
      icon: Trophy,
      badge: 'TOP',
      badgeColor: 'bg-yellow-400 text-yellow-950 font-black',
      color: 'hover:text-yellow-400',
      activeGradient: 'from-yellow-400 via-amber-500 to-orange-600 text-white shadow-amber-500/30',
    },
  ];

  return (
    <nav className="mb-6 bg-white/80 dark:bg-slate-900/75 backdrop-blur-2xl p-1.5 sm:p-2 rounded-2xl border border-slate-200/80 dark:border-white/15 shadow-xl sticky top-2 z-40">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 select-none ${
                isActive
                  ? `bg-gradient-to-r ${tab.activeGradient} shadow-lg scale-[1.02] border border-white/30 backdrop-blur-md`
                  : `text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 ${tab.color} border border-transparent`
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
              <span>{tab.label}</span>

              {tab.badge && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
