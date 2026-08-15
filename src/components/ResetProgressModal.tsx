import React, { useState } from 'react';
import { 
  RotateCcw, 
  AlertTriangle, 
  X, 
  Check, 
  Trash2, 
  Sparkles,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  PiggyBank,
  Timer,
  Trophy
} from 'lucide-react';
import { UserProfile, UserId } from '../types';
import { sound } from '../utils/audio';

interface ResetProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onConfirmReset: (userId: UserId, mode: 'defaults' | 'empty') => void;
}

export const ResetProgressModal: React.FC<ResetProgressModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirmReset
}) => {
  const [resetMode, setResetMode] = useState<'defaults' | 'empty'>('defaults');
  const [confirmedText, setConfirmedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExecuteReset = () => {
    setIsProcessing(true);
    sound.playAlert();
    setTimeout(() => {
      onConfirmReset(user.id, resetMode);
      setIsProcessing(false);
      setConfirmedText('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 dark:bg-slate-900 rounded-3xl border border-rose-500/30 p-6 sm:p-7 shadow-2xl text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing red accent orb */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
            <AlertTriangle className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold font-['Outfit'] text-white">
              Resetear Progreso de {user.name}
            </h3>
            <p className="text-xs text-rose-300/90 mt-0.5">
              Esta acción restablecerá el avance y datos guardados de este perfil.
            </p>
          </div>
        </div>

        {/* What will be reset overview */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 mb-5 text-xs text-slate-300">
          <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Módulos que se verán afectados:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Tareas y Entregas</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span>Materias y Horarios</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
              <span>Notas y Cortes</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <PiggyBank className="w-3.5 h-3.5 text-rose-400" />
              <span>Gastos y Metas</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Timer className="w-3.5 h-3.5 text-rose-400" />
              <span>Sesiones Pomodoro</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Trophy className="w-3.5 h-3.5 text-rose-400" />
              <span>XP, Nivel y Logros</span>
            </div>
          </div>
        </div>

        {/* Reset Mode Options */}
        <div className="space-y-2.5 mb-6">
          <label className="text-xs font-bold text-slate-200">
            Selecciona el tipo de reinicio:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setResetMode('defaults')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                resetMode === 'defaults'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Valores por Defecto</span>
                {resetMode === 'defaults' && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <span className="text-[10px] text-slate-400">
                Restaura las materias y tareas iniciales de {user.career}.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setResetMode('empty')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                resetMode === 'empty'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Pizarra en Blanco</span>
                {resetMode === 'empty' && <Check className="w-4 h-4 text-rose-400" />}
              </div>
              <span className="text-[10px] text-slate-400">
                Borra todo para que agregues tus materias desde cero.
              </span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleExecuteReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Reiniciando...' : 'Confirmar y Reiniciar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
