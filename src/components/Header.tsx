import React from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Sparkles, 
  Plus, 
  Volume2, 
  LogOut, 
  UserCheck, 
  Trophy,
  Edit3,
  GraduationCap
} from 'lucide-react';
import { AppNotification, UserProfile } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentUser: UserProfile;
  onSwitchUser: () => void;
  onLogout: () => void;
  onEditProfile?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onQuickAdd: () => void;
  onRequestPushPermission: () => void;
  pushPermission: NotificationPermission;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  onLogout,
  onEditProfile,
  darkMode,
  onToggleDarkMode,
  notifications,
  onOpenNotifications,
  onQuickAdd,
  onRequestPushPermission,
  pushPermission,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const todayFormatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const capitalizedDate = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);

  // Dynamic header background orbs based on user theme
  const orbs = currentUser.theme.bgGradientOrbs;

  return (
    <header className="relative overflow-hidden bg-slate-900/65 dark:bg-slate-900/80 backdrop-blur-2xl text-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl mb-6 transition-all duration-300 border border-white/20">
      {/* Decorative colorful glowing background orbs */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className={`absolute -top-8 -left-8 w-60 h-60 ${orbs.orb1} rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute -bottom-8 -right-8 w-60 h-60 ${orbs.orb2} rounded-full blur-3xl pointer-events-none`} />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Main Title & Dynamic Welcome */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase border border-white/20 text-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>Semestre 2026 • {currentUser.career}</span>
            </div>

            {/* Active User Chip */}
            <button
              onClick={() => {
                sound.playCoin();
                onSwitchUser();
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all hover:scale-105 active:scale-95 ${currentUser.theme.badgeAccent}`}
              title="Haz clic para cambiar de usuario"
            >
              <span>{currentUser.avatarEmoji}</span>
              <span>{currentUser.name}</span>
              <span className="opacity-70 text-[10px]">⇄ Cambiar</span>
            </button>

            {/* Edit Profile / Semester Button */}
            {onEditProfile && (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onEditProfile();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-slate-200 hover:text-white transition-all active:scale-95 shadow-sm"
                title="Editar Semestre y Perfil"
              >
                <Edit3 className="w-3.5 h-3.5 text-pink-300" />
                <span>Editar Semestre</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight font-['Outfit'] drop-shadow-md flex items-center gap-2.5 bg-gradient-to-r ${currentUser.theme.accentGradient} bg-clip-text text-transparent`}>
              {currentUser.theme.headerTitle}
              <span className="text-2xl sm:text-4xl animate-bounce drop-shadow">
                {currentUser.theme.headerEmoji}
              </span>
            </h1>
          </div>

          <p className="text-slate-200 text-xs sm:text-sm font-medium max-w-xl flex items-center flex-wrap gap-2">
            <span className="text-white/90 font-semibold">📅 {capitalizedDate}</span>
            <span className="opacity-40">•</span>
            {onEditProfile ? (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onEditProfile();
                }}
                className="inline-flex items-center gap-1 text-slate-200 hover:text-emerald-300 font-bold underline underline-offset-2 decoration-dotted transition-colors"
                title="Haz clic para cambiar de semestre"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentUser.semester}</span>
                <span className="text-[10px] text-emerald-300 font-normal ml-0.5">(Editar ✎)</span>
              </button>
            ) : (
              <span className="text-slate-300 font-semibold">{currentUser.semester}</span>
            )}
          </p>
        </div>

        {/* Action Controls (Quick Add, Push Notifications, Dark Mode, Switch/Logout) */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Push notification permission prompt */}
          {pushPermission !== 'granted' && (
            <button
              onClick={() => {
                sound.playAlert();
                onRequestPushPermission();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-400/90 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-lg backdrop-blur-md transition-all active:scale-95 border border-amber-300/60"
              title="Activar notificaciones de entrega en tu navegador"
            >
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Activar Alertas</span>
            </button>
          )}

          {/* Quick Add Button */}
          <button
            onClick={() => {
              sound.playCoin();
              onQuickAdd();
            }}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 border border-white/25 backdrop-blur-md ${currentUser.theme.buttonPrimary}`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Crear Nuevo</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              sound.playSuccess();
              onOpenNotifications();
            }}
            className="relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all active:scale-95 text-white shadow-sm"
            aria-label="Ver notificaciones y alertas"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200 hover:text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              sound.playSuccess();
              onToggleDarkMode();
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all active:scale-95 text-white shadow-sm"
            aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 transition-transform rotate-0 hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200 transition-transform rotate-0 hover:-rotate-45 duration-300" />
            )}
          </button>

          {/* Switch User / Logout Button */}
          <button
            onClick={() => {
              sound.playAlert();
              onLogout();
            }}
            className="p-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-rose-200 backdrop-blur-md transition-all active:scale-95 shadow-sm"
            title="Cerrar Sesión"
            aria-label="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
