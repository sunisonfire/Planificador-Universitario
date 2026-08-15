import React from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Wallet, 
  BookOpen, 
  Sparkles,
  Coffee
} from 'lucide-react';
import { TabType } from './Navigation';
import { sound } from '../utils/audio';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'task' | 'event' | 'expense' | 'subject') => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'task' as const,
      title: 'Nueva Tarea / Proyecto',
      description: 'Registra un deber con fecha de entrega y recordatorio',
      icon: CheckSquare,
      color: 'bg-purple-500 hover:bg-purple-600',
      tag: 'Académico 📝',
    },
    {
      id: 'event' as const,
      title: 'Programar Salida o Evento',
      description: 'Cita con amigos, café, cine, fiesta o parcial',
      icon: Coffee,
      color: 'bg-pink-500 hover:bg-pink-600',
      tag: 'Salidas 🍹',
    },
    {
      id: 'expense' as const,
      title: 'Registrar Gasto Diario',
      description: 'Apunta un consumo de comida, transporte o materiales',
      icon: Wallet,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      tag: 'Finanzas 💰',
    },
    {
      id: 'subject' as const,
      title: 'Inscribir Materia',
      description: 'Agrega una nueva asignatura con profesor y horario',
      icon: BookOpen,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      tag: 'Universidad 🎓',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="text-xl font-black text-white font-['Outfit']">
              ¿Qué deseas agregar, Isa?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 pt-2">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  sound.playSuccess();
                  onSelectAction(act.id);
                }}
                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all text-left flex items-center gap-4 group"
              >
                <div className={`p-3 rounded-2xl text-white shadow-md transition-transform group-hover:scale-110 ${act.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                      {act.title}
                    </h4>
                    <span className="text-[10px] font-black text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15 shrink-0">
                      {act.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 truncate">
                    {act.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
