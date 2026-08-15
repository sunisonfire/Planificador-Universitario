import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Trophy,
  Users,
  RotateCcw,
  Moon,
  Sun
} from 'lucide-react';
import { UserId, UserProfile } from '../types';
import { USER_PROFILES, authenticateUser } from '../utils/users';
import { sound } from '../utils/audio';
import { resetUserProgress, getInitialUserData, saveUserData } from '../utils/storage';
import { ResetProgressModal } from './ResetProgressModal';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  defaultUserId?: UserId;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  defaultUserId = 'isa',
  darkMode = true,
  onToggleDarkMode,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserId>(defaultUserId);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const activeProfile = USER_PROFILES[selectedUser];

  const handleSelectUser = (id: UserId) => {
    setSelectedUser(id);
    setPassword('');
    setErrorMessage(null);
    setResetFeedback(null);
    sound.playCoin();
  };

  const handleResetUser = (userId: UserId, mode: 'defaults' | 'empty') => {
    resetUserProgress(userId);
    if (mode === 'defaults') {
      const defs = getInitialUserData(userId);
      saveUserData(userId, 'subjects', defs.subjects);
      saveUserData(userId, 'tasks', defs.tasks);
      saveUserData(userId, 'grades', defs.grades);
      saveUserData(userId, 'events', defs.events);
      saveUserData(userId, 'expenses', defs.expenses);
      saveUserData(userId, 'budget', defs.budget);
      saveUserData(userId, 'goals', defs.goals);
      saveUserData(userId, 'notifications', []);
      saveUserData(userId, 'sessions', []);
    } else {
      const emptyBudget = { 
        month: '2026-08', 
        totalBudget: 500000, 
        categoryLimits: {
          comida: 150000,
          transporte: 80000,
          materiales: 50000,
          salidas: 70000,
          ocio: 50000,
          servicios: 30000,
          ahorro: 50000,
          otros: 20000
        }
      };
      saveUserData(userId, 'subjects', []);
      saveUserData(userId, 'tasks', []);
      saveUserData(userId, 'grades', []);
      saveUserData(userId, 'events', []);
      saveUserData(userId, 'expenses', []);
      saveUserData(userId, 'budget', emptyBudget);
      saveUserData(userId, 'goals', []);
      saveUserData(userId, 'notifications', []);
      saveUserData(userId, 'sessions', []);
    }
    sound.playSuccess();
    setResetFeedback(`¡Progreso de ${USER_PROFILES[userId].name} reiniciado con éxito!`);
  };

  const handleQuickFillPassword = (userKey: UserId) => {
    const prof = USER_PROFILES[userKey];
    setPassword(prof.password);
    setErrorMessage(null);
    sound.playSuccess();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authenticateUser(selectedUser, password);
      setIsLoading(false);

      if (result.success && result.profile) {
        sound.playSuccess();
        onLoginSuccess(result.profile);
      } else {
        sound.playAlert();
        setErrorMessage(result.error || 'Clave incorrecta');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans select-none antialiased">
      {/* Background Animated Ambient Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full blur-[140px] transition-all duration-700 ${
          selectedUser === 'anna' ? 'bg-red-600/35' : selectedUser === 'sun' ? 'bg-cyan-600/35' : 'bg-purple-600/30'
        }`} />
        <div className={`absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full blur-[160px] transition-all duration-700 ${
          selectedUser === 'anna' ? 'bg-rose-950/50' : selectedUser === 'sun' ? 'bg-teal-600/30' : 'bg-blue-600/25'
        }`} />
        <div className={`absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full blur-[150px] transition-all duration-700 ${
          selectedUser === 'anna' ? 'bg-red-950/40' : selectedUser === 'sun' ? 'bg-blue-800/30' : 'bg-pink-600/20'
        }`} />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Top App Logo & Welcome Banner */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-bold uppercase tracking-wider text-slate-200 shadow-md">
            <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
            <span>UniPlanner • Multi-Perfil & Liga de Logros</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Iniciar Sesión
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Selecciona tu perfil universitario e ingresa tu clave para acceder a tus materias, tareas, finanzas y competir por el podio de logros.
          </p>
        </div>

        {/* Login Card */}
        <div className={`rounded-3xl bg-slate-900/75 backdrop-blur-2xl border ${
          selectedUser === 'anna' ? 'border-red-500/30 shadow-red-950/50' : 
          selectedUser === 'sun' ? 'border-cyan-500/30 shadow-cyan-950/50' : 
          'border-purple-500/30 shadow-purple-950/50'
        } shadow-2xl p-6 sm:p-8 transition-all duration-300 ${isShaking ? 'animate-bounce' : ''}`}>
          
          {/* Top Bar inside Card: Dark Mode Toggle & Feedback */}
          {onToggleDarkMode && (
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-yellow-300" /> : <Moon className="w-3.5 h-3.5 text-purple-300" />}
                <span className="text-[11px]">{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
              </button>
            </div>
          )}

          {resetFeedback && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{resetFeedback}</span>
            </div>
          )}
          
          {/* User Selector Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-300 mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>¿Quién va a estudiar hoy?</span>
              </span>
              <span className="text-[11px] text-slate-400">3 perfiles disponibles</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {(Object.keys(USER_PROFILES) as UserId[]).map((userId) => {
                const prof = USER_PROFILES[userId];
                const isCurrent = selectedUser === userId;

                let cardStyle = '';
                if (isCurrent) {
                  if (userId === 'anna') {
                    cardStyle = 'bg-gradient-to-b from-red-600/30 to-red-950/60 border-red-500 text-white shadow-lg shadow-red-600/20 ring-2 ring-red-500/50';
                  } else if (userId === 'sun') {
                    cardStyle = 'bg-gradient-to-b from-cyan-600/30 to-blue-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-600/20 ring-2 ring-cyan-400/50';
                  } else {
                    cardStyle = 'bg-gradient-to-b from-purple-600/30 to-pink-950/60 border-pink-400 text-white shadow-lg shadow-purple-600/20 ring-2 ring-pink-400/50';
                  }
                } else {
                  cardStyle = 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200 hover:border-white/25';
                }

                return (
                  <button
                    key={userId}
                    type="button"
                    onClick={() => handleSelectUser(userId)}
                    className={`p-3 sm:p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1.5 relative overflow-hidden group ${cardStyle}`}
                  >
                    <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110">
                      {prof.avatarEmoji}
                    </span>
                    <span className="font-extrabold text-sm sm:text-base tracking-wide">
                      {prof.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] opacity-75 truncate max-w-full font-medium">
                      {prof.career.split('&')[0].trim()}
                    </span>

                    {isCurrent && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Profile Preview Chip */}
          <div className={`p-4 rounded-2xl mb-6 border backdrop-blur-md flex items-center gap-3.5 transition-all ${
            selectedUser === 'anna' ? 'bg-red-950/30 border-red-500/25' :
            selectedUser === 'sun' ? 'bg-cyan-950/30 border-cyan-500/25' :
            'bg-purple-950/30 border-purple-500/25'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border ${
              selectedUser === 'anna' ? 'bg-red-600 border-red-400' :
              selectedUser === 'sun' ? 'bg-cyan-600 border-cyan-400' :
              'bg-purple-600 border-purple-400'
            }`}>
              {activeProfile.avatarEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-extrabold text-white text-base truncate">
                  {activeProfile.name}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeProfile.theme.badgeAccent}`}>
                  {activeProfile.semester}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate">
                {activeProfile.career}
              </p>
              <p className="text-[11px] text-slate-400 italic mt-0.5 truncate">
                "{activeProfile.bio}"
              </p>
            </div>
          </div>

          {/* Password Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contraseña de Acceso</span>
                </label>

                {/* Convenient quick-fill helper */}
                <button
                  type="button"
                  onClick={() => handleQuickFillPassword(selectedUser)}
                  className={`text-[11px] font-bold transition-colors hover:underline flex items-center gap-1 ${activeProfile.theme.highlightText}`}
                  title={`Ingresar clave predeterminada (${activeProfile.password})`}
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Auto-completar clave ({activeProfile.password})</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder={`Ingresa la clave de ${activeProfile.name}...`}
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/60 focus:border-transparent backdrop-blur-md transition-all font-mono"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${activeProfile.theme.buttonPrimary}`}
            >
              {isLoading ? (
                <span>Entrando a UniPlanner...</span>
              ) : (
                <>
                  <span>Ingresar como {activeProfile.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Reference Footer */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-[11px] font-bold text-slate-400 text-center mb-2">
              🔑 Claves configuradas por usuario:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedUser('anna');
                  handleQuickFillPassword('anna');
                }}
                className="p-1.5 rounded-xl bg-red-950/30 border border-red-500/20 hover:border-red-500/50 text-[10px] text-red-300 transition-colors"
              >
                <div className="font-bold">🌹 Anna</div>
                <div className="font-mono opacity-80">annanation</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedUser('isa');
                  handleQuickFillPassword('isa');
                }}
                className="p-1.5 rounded-xl bg-purple-950/30 border border-purple-500/20 hover:border-purple-500/50 text-[10px] text-purple-300 transition-colors"
              >
                <div className="font-bold">✨ Isa</div>
                <div className="font-mono opacity-80">ykisartt</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedUser('sun');
                  handleQuickFillPassword('sun');
                }}
                className="p-1.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-500/50 text-[10px] text-cyan-300 transition-colors"
              >
                <div className="font-bold">🌊 Sun</div>
                <div className="font-mono opacity-80">swnni3</div>
              </button>
            </div>

            {/* Reset Progress Button at bottom of selected profile */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                ¿Deseas reiniciar los datos de {activeProfile.name}?
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playAlert();
                  setIsResetModalOpen(true);
                }}
                className="text-rose-400 hover:text-rose-300 font-bold hover:underline flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Resetear Progreso</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature summary pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Entorno de estudio personalizado
          </span>
          <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Datos independientes por estudiante
          </span>
          <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Competencia y podio de logros
          </span>
        </div>
      </div>

      {/* Reset Progress Confirmation Modal */}
      <ResetProgressModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        user={activeProfile}
        onConfirmReset={handleResetUser}
      />
    </div>
  );
};
