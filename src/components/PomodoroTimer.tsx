import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Task, 
  Subject, 
  UserProfile, 
  PomodoroSession 
} from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  CheckCircle2, 
  Clock, 
  Target, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Plus, 
  CheckSquare, 
  History, 
  Sliders, 
  Coffee, 
  BrainCircuit, 
  Calendar,
  Zap
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { NotificationManager } from '../utils/notifications';

interface PomodoroTimerProps {
  tasks: Task[];
  subjects: Subject[];
  currentUser: UserProfile;
  onUpdateTask: (task: Task) => void;
  sessions: PomodoroSession[];
  onAddSession: (session: Omit<PomodoroSession, 'id'>) => void;
  onClearSessions?: () => void;
}

type PomodoroMode = 'pomodoro' | 'short_break' | 'long_break';

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  tasks,
  subjects,
  currentUser,
  onUpdateTask,
  sessions,
  onAddSession,
  onClearSessions,
}) => {
  // Configurable Durations (in minutes)
  const [pomodoroMinutes, setPomodoroMinutes] = useState<number>(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState<number>(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState<number>(15);

  const [currentMode, setCurrentMode] = useState<PomodoroMode>('pomodoro');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tickSoundEnabled, setTickSoundEnabled] = useState<boolean>(false);
  const [autoStartBreaks, setAutoStartBreaks] = useState<boolean>(false);

  // Selected task to track time for
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Completed sessions count for today
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.timestamp.startsWith(todayDateStr) && s.mode === 'pomodoro');
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const selectedTaskSubject = subjects.find(s => s.id === selectedTask?.subjectId);

  // Get total duration for current mode in seconds
  const getTotalDuration = useCallback((mode: PomodoroMode): number => {
    switch (mode) {
      case 'pomodoro': return pomodoroMinutes * 60;
      case 'short_break': return shortBreakMinutes * 60;
      case 'long_break': return longBreakMinutes * 60;
    }
  }, [pomodoroMinutes, shortBreakMinutes, longBreakMinutes]);

  const totalSeconds = getTotalDuration(currentMode);

  // Handle Session Completed
  const handleSessionCompleted = useCallback(() => {
    setIsActive(false);

    if (soundEnabled) {
      sound.playPomodoroFinish();
    }

    const durationMinutes = Math.max(1, Math.round(totalSeconds / 60));

    // Save session log
    onAddSession({
      taskId: selectedTask?.id,
      taskTitle: selectedTask?.title,
      subjectId: selectedTask?.subjectId,
      durationMinutes,
      timestamp: new Date().toISOString(),
      mode: currentMode,
    });

    // If it was a pomodoro study session linked to a task, update task's logged time
    if (currentMode === 'pomodoro' && selectedTask) {
      const updatedMinutes = (selectedTask.studyMinutes || 0) + durationMinutes;
      onUpdateTask({
        ...selectedTask,
        studyMinutes: updatedMinutes,
      });

      NotificationManager.sendPushNotification(`🎉 ¡Pomodoro completado! (${durationMinutes} min)`, {
        body: `Excelente sesión de estudio en: "${selectedTask.title}". Tómate un merecido descanso.`,
      });
    } else {
      NotificationManager.sendPushNotification(`🔔 ¡Tiempo cumplido!`, {
        body: currentMode === 'pomodoro' 
          ? '¡Gran sesión de concentración! Tómate un descanso.' 
          : '¡Descanso terminado! ¿Lista para el siguiente bloque de estudio?',
      });
    }

    if (currentMode === 'pomodoro') {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 }
      });
      // Switch to short break
      setCurrentMode('short_break');
      setTimeLeftSeconds(shortBreakMinutes * 60);
      setIsActive(autoStartBreaks);
    } else {
      // Switch back to pomodoro
      setCurrentMode('pomodoro');
      setTimeLeftSeconds(pomodoroMinutes * 60);
      setIsActive(autoStartBreaks);
    }
  }, [
    autoStartBreaks, 
    currentMode, 
    onAddSession, 
    onUpdateTask, 
    pomodoroMinutes, 
    selectedTask, 
    shortBreakMinutes, 
    soundEnabled, 
    totalSeconds
  ]);

  // Robust Timer Interval
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          return 0;
        }
        if (tickSoundEnabled && prev % 2 === 0) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, tickSoundEnabled]);

  // Watch for timer hitting 0
  useEffect(() => {
    if (isActive && timeLeftSeconds === 0) {
      handleSessionCompleted();
    }
  }, [isActive, timeLeftSeconds, handleSessionCompleted]);

  const switchMode = (mode: PomodoroMode, autoStart = false) => {
    setCurrentMode(mode);
    let dur = pomodoroMinutes * 60;
    if (mode === 'short_break') dur = shortBreakMinutes * 60;
    if (mode === 'long_break') dur = longBreakMinutes * 60;
    setTimeLeftSeconds(dur);
    setIsActive(autoStart);
    sound.playSuccess();
  };

  const toggleTimer = () => {
    if (!isActive) {
      sound.playSuccess();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeftSeconds(getTotalDuration(currentMode));
    sound.playAlert();
  };

  const skipTimer = () => {
    if (currentMode === 'pomodoro') {
      switchMode('short_break', false);
    } else {
      switchMode('pomodoro', false);
    }
  };

  const addMinutes = (mins: number) => {
    setTimeLeftSeconds((prev) => prev + mins * 60);
    sound.playCoin();
  };

  const handleMarkTaskComplete = () => {
    if (!selectedTask) return;
    onUpdateTask({
      ...selectedTask,
      status: 'completada',
    });
    sound.playSuccess();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Circular progress math
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - timeLeftSeconds) / (totalSeconds || 1)) * 100));
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  // Filter tasks to show pending and in-progress first
  const activeTasks = tasks.filter(t => t.status !== 'completada');
  const completedTasks = tasks.filter(t => t.status === 'completada');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
              <span>Temporizador Pomodoro & Sesiones de Estudio</span>
              <span className="text-xl">⏱️⚡</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Entrena tu concentración, asocia tiempo a tus entregas y vence la procrastinación
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-2xl border transition-all ${
              soundEnabled 
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
              isSettingsOpen 
                ? 'bg-white text-slate-900 border-white shadow-md' 
                : 'bg-white/10 hover:bg-white/15 border-white/15 text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Ajustar Tiempos</span>
          </button>
        </div>
      </div>

      {/* Settings Panel (Collapsible) */}
      {isSettingsOpen && (
        <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Configuración de Intervalos de Tiempo (Minutos)</span>
            </h3>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              Cerrar ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                🎯 Estudio / Pomodoro (min)
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[1, 5, 15, 20, 25, 30, 45, 50].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setPomodoroMinutes(val);
                      if (currentMode === 'pomodoro' && !isActive) {
                        setTimeLeftSeconds(val * 60);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      pomodoroMinutes === val
                        ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {val}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ☕ Pausa Corta (min)
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[1, 3, 5, 8, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setShortBreakMinutes(val);
                      if (currentMode === 'short_break' && !isActive) {
                        setTimeLeftSeconds(val * 60);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      shortBreakMinutes === val
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {val}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                🌴 Pausa Larga (min)
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[5, 10, 15, 20, 30].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setLongBreakMinutes(val);
                      if (currentMode === 'long_break' && !isActive) {
                        setTimeLeftSeconds(val * 60);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      longBreakMinutes === val
                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {val}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tickSoundEnabled}
                onChange={(e) => setTickSoundEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600"
              />
              <span>Sonido de reloj suave (Ticking) mientras corre el tiempo</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(e) => setAutoStartBreaks(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600"
              />
              <span>Iniciar descansos automáticamente al finalizar</span>
            </label>
          </div>
        </div>
      )}

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Pomodoro Stage (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/65 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-6 flex flex-col justify-between items-center text-center">
          
          {/* Mode Pill Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md w-full max-w-md justify-between">
            <button
              onClick={() => switchMode('pomodoro')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                currentMode === 'pomodoro'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Estudio ({pomodoroMinutes}m)</span>
            </button>

            <button
              onClick={() => switchMode('short_break')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                currentMode === 'short_break'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Pausa Corta ({shortBreakMinutes}m)</span>
            </button>

            <button
              onClick={() => switchMode('long_break')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                currentMode === 'long_break'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🌴 Pausa ({longBreakMinutes}m)</span>
            </button>
          </div>

          {/* Linked Task Chip / Selector */}
          <div className="w-full max-w-md p-3.5 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>Trabajando en la tarea:</span>
              </span>

              {selectedTask && (
                <span className="text-[11px] font-bold text-emerald-400">
                  {(selectedTask.studyMinutes || 0)} min acumulados
                </span>
              )}
            </div>

            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">🎯 Estudio Libre (Sin vincular a tarea)</option>
              {activeTasks.length > 0 && (
                <optgroup label="📋 Tareas Pendientes y en Progreso" className="bg-slate-900 text-slate-200">
                  {activeTasks.map((t) => {
                    const sub = subjects.find(s => s.id === t.subjectId);
                    return (
                      <option key={t.id} value={t.id}>
                        {sub ? `[${sub.name}] ` : ''}{t.title} ({t.dueDate})
                      </option>
                    );
                  })}
                </optgroup>
              )}

              {completedTasks.length > 0 && (
                <optgroup label="✅ Tareas Completadas" className="bg-slate-900 text-slate-400">
                  {completedTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      ✓ {t.title}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>

            {/* Selected Task Details preview */}
            {selectedTask && (
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  {selectedTaskSubject && (
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: selectedTaskSubject.color }} 
                    />
                  )}
                  <span className="truncate">{selectedTask.title}</span>
                </div>

                {selectedTask.status !== 'completada' && (
                  <button
                    type="button"
                    onClick={handleMarkTaskComplete}
                    className="text-emerald-400 hover:text-emerald-300 font-bold shrink-0 flex items-center gap-1 hover:underline ml-2"
                  >
                    <CheckSquare className="w-3 h-3" />
                    <span>Marcar lista</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Big Circular Animated Countdown Stage */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
              {/* Background circle track */}
              <circle
                cx="50%"
                cy="50%"
                r="70"
                className="text-white/10 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="50%"
                cy="50%"
                r="70"
                className="transition-all duration-700 stroke-current"
                strokeWidth="10"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  color: currentMode === 'pomodoro' 
                    ? currentUser.theme.primaryColor || '#EC4899'
                    : currentMode === 'short_break'
                    ? '#10B981'
                    : '#06B6D4'
                }}
              />
            </svg>

            {/* Center Digital Display & Status */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight drop-shadow-lg">
                {formatTime(timeLeftSeconds)}
              </span>

              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">
                {isActive ? (
                  <span className="flex items-center gap-1 text-emerald-400 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    En Progreso
                  </span>
                ) : (
                  <span>Pausado</span>
                )}
              </span>

              <span className="text-[11px] text-slate-400 font-medium mt-1">
                {currentMode === 'pomodoro' ? 'Bloque de Estudio' : 'Tiempo de Descanso'}
              </span>
            </div>
          </div>

          {/* Interactive Play Controls */}
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <div className="flex items-center gap-3 sm:gap-4 justify-center flex-wrap">
              <button
                onClick={resetTimer}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all active:scale-95 shadow-md"
                title="Reiniciar temporizador"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTimer}
                className={`px-8 py-4 rounded-3xl font-black text-base transition-all transform active:scale-95 shadow-xl flex items-center gap-3 ${
                  isActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-amber-500/30 ring-2 ring-amber-400/50'
                    : `bg-gradient-to-r ${currentUser.theme.accentGradient} text-white shadow-lg shadow-purple-500/30 ring-2 ring-white/20 hover:scale-105`
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-6 h-6 fill-current" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span>Comenzar Sesión</span>
                  </>
                )}
              </button>

              <button
                onClick={skipTimer}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white transition-all active:scale-95 shadow-md"
                title="Saltar al siguiente bloque"
              >
                <FastForward className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Time Add / Complete Now Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-center pt-1">
              <button
                onClick={() => addMinutes(1)}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-bold text-slate-200 transition-colors"
              >
                +1 min
              </button>
              <button
                onClick={() => addMinutes(5)}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-bold text-slate-200 transition-colors"
              >
                +5 min
              </button>
              <button
                onClick={handleSessionCompleted}
                className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 transition-colors flex items-center gap-1"
                title="Completar bloque y registrar puntos"
              >
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Completar Ahora</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Today Stats & Study Log History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Daily KPI Stats Card */}
          <div className="p-6 rounded-3xl bg-slate-900/65 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white font-['Outfit'] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Rendimiento de Hoy ({todayDateStr})</span>
              </span>
              <span className="text-xs font-black text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                {todaySessions.length} Pomodoros
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Tiempo Enfocado
                </span>
                <span className="text-2xl font-black text-white font-['Outfit']">
                  {todayMinutes}
                  <span className="text-xs font-normal text-slate-300"> min</span>
                </span>
                <p className="text-[10px] text-emerald-400 mt-1">
                  {(todayMinutes / 60).toFixed(1)} horas de concentración
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Meta Diaria
                </span>
                <span className="text-2xl font-black text-amber-300 font-['Outfit']">
                  {todaySessions.length} / 4
                </span>
                <p className="text-[10px] text-slate-300 mt-1">
                  {todaySessions.length >= 4 ? '🎉 ¡Meta diaria lograda!' : `Faltan ${Math.max(0, 4 - todaySessions.length)} bloques`}
                </p>
              </div>
            </div>

            {/* Daily Goal Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300 font-bold">
                <span>Progreso hacia 4 pomodoros diarios</span>
                <span>{Math.min(100, Math.round((todaySessions.length / 4) * 100))}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (todaySessions.length / 4) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recent Study Sessions History Log */}
          <div className="p-6 rounded-3xl bg-slate-900/65 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" />
                <span>Historial de Bloques Completados</span>
              </h3>
              {sessions.length > 0 && onClearSessions && (
                <button
                  onClick={() => {
                    onClearSessions();
                    sound.playAlert();
                  }}
                  className="text-[11px] font-bold text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2 border border-dashed border-white/10 rounded-2xl p-4">
                <Sparkles className="w-6 h-6 text-purple-400 mx-auto opacity-70" />
                <p className="text-xs font-semibold">Aún no has registrado bloques hoy</p>
                <p className="text-[11px] text-slate-500">Inicia el temporizador para comenzar a sumar minutos de estudio.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {sessions.slice(0, 10).map((s) => {
                  const timeFormatted = new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          s.mode === 'pomodoro' ? 'bg-pink-500' : 'bg-emerald-400'
                        }`} />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white truncate">
                            {s.taskTitle || (s.mode === 'pomodoro' ? 'Estudio Libre' : 'Pausa')}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {timeFormatted} • {s.mode === 'pomodoro' ? 'Enfoque' : 'Descanso'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-amber-300">
                          +{s.durationMinutes} min
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
