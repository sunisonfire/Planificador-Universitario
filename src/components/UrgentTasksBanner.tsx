import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Flame, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, Subject } from '../types';
import { NotificationManager } from '../utils/notifications';
import { sound } from '../utils/audio';

interface UrgentTasksBannerProps {
  tasks: Task[];
  subjects: Subject[];
  onToggleTaskStatus: (taskId: string) => void;
  onGoToTasks: () => void;
  onOpenTaskModal: (task: Task) => void;
}

export const UrgentTasksBanner: React.FC<UrgentTasksBannerProps> = ({
  tasks,
  subjects,
  onToggleTaskStatus,
  onGoToTasks,
  onOpenTaskModal,
}) => {
  // Get non-completed tasks due in <= 3 days (or overdue)
  const urgentTasks = tasks
    .filter(task => task.status !== 'completada')
    .map(task => {
      const urgency = NotificationManager.isDueSoon(task.dueDate);
      const subject = subjects.find(s => s.id === task.subjectId);
      return {
        task,
        urgency,
        subject,
      };
    })
    .filter(item => item.urgency.isDue)
    .sort((a, b) => a.urgency.daysLeft - b.urgency.daysLeft);

  if (urgentTasks.length === 0) {
    return (
      <div className="mb-8 p-5 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-emerald-500/30 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-sm">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>¡Al día con tus entregas, Isa!</span>
              <span>🌸</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              No tienes tareas urgentes para los próximos 3 días. ¡Excelente organización académica!
            </p>
          </div>
        </div>
        <button
          onClick={onGoToTasks}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <span>Ver todas las tareas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const handleComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    onToggleTaskStatus(taskId);
  };

  return (
    <section className="mb-8 p-5 sm:p-6 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-rose-500/30 shadow-2xl relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header of banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/20 backdrop-blur-md text-rose-300 border border-rose-500/30 shadow-md shadow-rose-500/20 animate-pulse">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-['Outfit']">
                ¡Alerta de Entregas Próximas! (&lt; 3 días) 🚨
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black shadow-sm border border-rose-400/40">
                {urgentTasks.length} {urgentTasks.length === 1 ? 'tarea' : 'tareas'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Estas son las tareas que están a punto de vencer. ¡No las dejes para última hora!
            </p>
          </div>
        </div>

        <button
          onClick={onGoToTasks}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-sm border border-white/20 backdrop-blur-md transition-all active:scale-95"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of urgent task cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {urgentTasks.map(({ task, urgency, subject }) => {
          const isOverdue = urgency.isOverdue;
          const isToday = urgency.daysLeft === 0;
          const isTomorrow = urgency.daysLeft === 1;

          let badgeStyle = 'bg-amber-500 text-white border border-amber-300/40';
          if (isOverdue) badgeStyle = 'bg-red-600 text-white animate-bounce border border-red-300/40';
          else if (isToday) badgeStyle = 'bg-rose-500 text-white animate-pulse border border-rose-300/40';
          else if (isTomorrow) badgeStyle = 'bg-orange-500 text-white border border-orange-300/40';

          return (
            <div
              key={task.id}
              onClick={() => onOpenTaskModal(task)}
              className="group relative cursor-pointer p-4 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-rose-400/50 shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Top Row: Subject & Urgency Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold text-white shadow-xs"
                  style={{ backgroundColor: subject?.color || '#8B5CF6' }}
                >
                  <BookOpen className="w-3 h-3" />
                  <span className="truncate max-w-[120px]">{subject?.name || 'Materia'}</span>
                </span>

                <span className={`px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs ${badgeStyle}`}>
                  {urgency.label}
                </span>
              </div>

              {/* Task Title & Description */}
              <div className="mb-3">
                <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-2">
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-normal">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Bottom Row: Due date/time & Quick Complete Check */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    {task.dueDate} • {task.dueTime || '23:59'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleComplete(task.id, e)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 backdrop-blur-md transition-transform active:scale-95"
                  title="Marcar como completada"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lista</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
