import React from 'react';
import { 
  Subject, 
  Task, 
  GradeComponent, 
  CalendarEvent, 
  Expense, 
  MonthlyBudget, 
  SavingsGoal,
  UserProfile
} from '../types';
import { UrgentTasksBanner } from './UrgentTasksBanner';
import { 
  Calendar, 
  Clock, 
  GraduationCap, 
  Wallet, 
  Sparkles, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  MapPin, 
  Heart,
  Coffee,
  ArrowUpRight,
  PiggyBank,
  Check,
  Trophy,
  Crown,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { getAllUsersLeaderboard } from '../utils/storage';
import { getLevelFromXP } from '../utils/users';

interface DashboardProps {
  subjects: Subject[];
  tasks: Task[];
  grades: GradeComponent[];
  events: CalendarEvent[];
  expenses: Expense[];
  budget: MonthlyBudget;
  goals: SavingsGoal[];
  currentUser: UserProfile;
  onToggleTaskStatus: (taskId: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenTaskModal: (task?: Task) => void;
  onOpenEventModal: (event?: CalendarEvent) => void;
  onOpenExpenseModal: () => void;
  onOpenEditProfile?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  subjects,
  tasks,
  grades,
  events,
  expenses,
  budget,
  goals,
  currentUser,
  onToggleTaskStatus,
  onNavigateTab,
  onOpenTaskModal,
  onOpenEventModal,
  onOpenExpenseModal,
  onOpenEditProfile,
}) => {
  // Current day name in Spanish
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const currentDayIndex = new Date().getDay();
  const currentDayName = daysOfWeek[currentDayIndex];
  const todayDateStr = new Date().toISOString().split('T')[0];

  // Leaderboard data for current user
  const leaderboard = getAllUsersLeaderboard();
  const myStats = leaderboard.find(l => l.userId === currentUser.id) || leaderboard[0];
  const myLevel = getLevelFromXP(myStats.totalXP);
  const myRank = myStats.rank || 1;

  // Today's classes
  const todayClasses: { subject: Subject; scheduleItem: Subject['schedule'][0] }[] = [];
  subjects.forEach(subject => {
    subject.schedule.forEach(item => {
      if (item.day === currentDayName) {
        todayClasses.push({ subject, scheduleItem: item });
      }
    });
  });
  // Sort classes by start time
  todayClasses.sort((a, b) => a.scheduleItem.startTime.localeCompare(b.scheduleItem.startTime));

  // Compute Academic GPA
  let totalGradeWeight = 0;
  let totalGradeAccum = 0;

  subjects.forEach(sub => {
    const subGrades = grades.filter(g => g.subjectId === sub.id && g.isCompleted && g.score !== undefined);
    if (subGrades.length > 0) {
      let subWeight = 0;
      let subAccum = 0;
      subGrades.forEach(g => {
        subWeight += g.percentage;
        subAccum += ((g.score || 0) * g.percentage) / 100;
      });
      if (subWeight > 0) {
        const subAverage = (subAccum / subWeight) * 100;
        totalGradeAccum += subAverage * sub.credits;
        totalGradeWeight += sub.credits;
      }
    }
  });

  const overallGPA = totalGradeWeight > 0 ? (totalGradeAccum / totalGradeWeight) : 0.0;

  // Monthly Budget calculations
  const totalSpentThisMonth = expenses
    .filter(e => e.date.startsWith(budget.month))
    .reduce((sum, e) => sum + e.amount, 0);

  const budgetRemaining = Math.max(0, budget.totalBudget - totalSpentThisMonth);
  const budgetPercentage = budget.totalBudget > 0 ? Math.min(100, Math.round((totalSpentThisMonth / budget.totalBudget) * 100)) : 0;

  // Next upcoming social/salida event
  const upcomingEvents = events
    .filter(e => e.date >= todayDateStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  const nextOuting = upcomingEvents.find(e => e.category === 'salida' || e.category === 'social');

  // Top pending tasks
  const pendingTasks = tasks
    .filter(t => t.status !== 'completada')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  return (
    <div className="space-y-6">
      {/* 🚨 Urgent Tasks Banner (<3 days alert) */}
      <UrgentTasksBanner
        tasks={tasks}
        subjects={subjects}
        onToggleTaskStatus={onToggleTaskStatus}
        onGoToTasks={() => onNavigateTab('tasks')}
        onOpenTaskModal={(task) => onOpenTaskModal(task)}
      />

      {/* Top 4 Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Academic Status / GPA */}
        <div 
          onClick={() => onNavigateTab('grades')}
          className="group cursor-pointer relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-purple-200 tracking-wider uppercase">Promedio Actual</span>
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-yellow-300" />
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-3xl sm:text-4xl font-black font-['Outfit']">
              {overallGPA.toFixed(1)}
            </span>
            <span className="text-purple-200 text-xs font-semibold">/ 5.0</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-purple-100 font-medium truncate">
            <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" />
            <span className="truncate">{overallGPA >= 3.0 ? '¡Pasando el semestre con éxito!' : 'Atención a próximas notas'}</span>
          </div>
        </div>

        {/* Metric 2: Monthly Budget Status */}
        <div 
          onClick={() => onNavigateTab('finance')}
          className="group cursor-pointer relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-emerald-200 tracking-wider uppercase">Presupuesto Libre</span>
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Wallet className="w-4 h-4 text-emerald-200" />
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-2xl sm:text-3xl font-black font-['Outfit'] truncate">
              {formatCurrency(budgetRemaining)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-emerald-950/40 rounded-full h-1.5 overflow-hidden mb-1">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                budgetPercentage > 85 ? 'bg-rose-400' : 'bg-yellow-300'
              }`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-emerald-100 font-semibold">
            <span>{budgetPercentage}% usado</span>
            <span>Tope: {formatCurrency(budget.totalBudget)}</span>
          </div>
        </div>

        {/* Metric 3: Next Social Outing */}
        <div 
          onClick={() => onNavigateTab('calendar')}
          className="group cursor-pointer relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-pink-200 tracking-wider uppercase">Próxima Salida</span>
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Coffee className="w-4 h-4 text-yellow-200" />
            </span>
          </div>

          {nextOuting ? (
            <div>
              <h4 className="text-sm sm:text-base font-bold font-['Outfit'] line-clamp-1 mb-0.5">
                {nextOuting.title}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-pink-100 mb-0.5">
                <Calendar className="w-3 h-3" />
                <span>{nextOuting.date} • {nextOuting.startTime}</span>
              </div>
              {nextOuting.location && (
                <div className="flex items-center gap-1 text-[10px] text-pink-200 truncate">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{nextOuting.location}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-1">
              <p className="text-xs font-semibold text-pink-100">Sin salidas agendadas</p>
              <p className="text-[11px] text-pink-200 mt-0.5">¡Agenda una tarde de café!</p>
            </div>
          )}
        </div>

        {/* Metric 4: Achievements & Competence Rank */}
        <div 
          onClick={() => onNavigateTab('achievements')}
          className="group cursor-pointer relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-amber-200 tracking-wider uppercase">Liga de Logros</span>
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Trophy className="w-4 h-4 text-yellow-200 animate-bounce" />
            </span>
          </div>

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black">{myRank === 1 ? '🥇 #1' : myRank === 2 ? '🥈 #2' : '🥉 #3'}</span>
              <span className="text-xs font-bold text-yellow-200">
                {myRank === 1 ? '¡Líder!' : 'En podio'}
              </span>
            </div>
            <span className="text-sm font-black px-2 py-0.5 rounded-lg bg-black/20 text-yellow-300">
              {myStats.totalXP} XP
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-amber-100 font-medium">
            <span>Nivel {myLevel.level} • {myLevel.title}</span>
            <span className="underline">Ver liga →</span>
          </div>
        </div>
      </div>

      {/* ⏱️ Pomodoro Focus Mode Quick Banner */}
      <div 
        onClick={() => onNavigateTab('pomodoro')}
        className="cursor-pointer group p-4 sm:p-5 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 hover:bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400/60 shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition-transform">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-white font-['Outfit']">
                Modo de Estudio & Temporizador Pomodoro 🍅
              </h4>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Nuevo
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Enfócate en bloques de 25 minutos con descansos guiados y vincula tus horas de estudio a tus tareas universitarias
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigateTab('pomodoro');
          }}
          className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
        >
          <Timer className="w-4 h-4" />
          <span>Iniciar Pomodoro</span>
        </button>
      </div>

      {/* Main 2-Column Section: Today's Schedule & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Today's Class Schedule (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/15 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-500/20 backdrop-blur-md text-violet-300 border border-violet-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Clases de Hoy ({currentDayName})
                </h3>
                <p className="text-xs text-slate-300">
                  {todayClasses.length} {todayClasses.length === 1 ? 'materia programada' : 'materias programadas'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('subjects')}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 hover:underline flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {todayClasses.length > 0 ? (
              todayClasses.map(({ subject, scheduleItem }, index) => (
                <div
                  key={`${subject.id}-${index}`}
                  className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all flex items-start gap-3.5"
                >
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0 shadow-xs"
                    style={{ backgroundColor: subject.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-white truncate">
                        {subject.name}
                      </h4>
                      <span className="text-xs font-bold text-violet-300 shrink-0 bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 rounded-md">
                        {scheduleItem.startTime} - {scheduleItem.endTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{scheduleItem.location || subject.classroom || 'Aula asignada'}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Prof. {subject.professor}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 px-4 bg-white/5 rounded-2xl border border-dashed border-white/15">
                <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">
                  ¡No tienes clases hoy {currentDayName}!
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Aprovecha para adelantar tareas, estudiar o disfrutar una salida.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Pending Tasks Checklist (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/15 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-500/20 backdrop-blur-md text-pink-300 border border-pink-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Próximas Tareas & Deberes
                </h3>
                <p className="text-xs text-slate-300">
                  {pendingTasks.length} pendientes en lista
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenTaskModal()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 font-bold text-xs border border-pink-500/30 backdrop-blur-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Tarea</span>
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {pendingTasks.map((task) => {
              const sub = subjects.find(s => s.id === task.subjectId);
              return (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskModal(task)}
                  className="group cursor-pointer p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-pink-400/40 backdrop-blur-md transition-all flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playSuccess();
                        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
                        onToggleTaskStatus(task.id);
                      }}
                      className="w-5 h-5 rounded-lg border-2 border-slate-400 hover:border-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center transition-all shrink-0"
                    >
                      {task.status === 'completada' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>

                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[10px] font-extrabold text-white px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: sub?.color || '#8B5CF6' }}
                        >
                          {sub?.name || 'Materia'}
                        </span>
                        <span className="text-[11px] text-slate-300 font-medium">
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shrink-0 border ${
                    task.priority === 'alta' 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                      : task.priority === 'media'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-white/10 text-slate-300 border-white/10'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
            <span className="text-slate-300">¿Quieres ver el calendario completo?</span>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="font-bold text-pink-400 hover:text-pink-300 hover:underline"
            >
              Ir a Calendario & Salidas →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Financial Goals Progress preview */}
      <div className="bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-white/15 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Metas Financieras de {currentUser.name} 🎯
              </h3>
              <p className="text-xs text-slate-300">
                Ahorros para viajes, tecnología, congresos y salidas
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('finance')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
          >
            <span>Ver finanzas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.slice(0, 4).map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <div 
                key={goal.id}
                onClick={() => onNavigateTab('finance')}
                className="cursor-pointer p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 backdrop-blur-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white truncate pr-2">
                    {goal.title}
                  </h4>
                  <span className="text-xs font-black text-amber-400 shrink-0">
                    {pct}%
                  </span>
                </div>

                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${pct}%`,
                      backgroundColor: goal.color || '#F59E0B'
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>Meta: {formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
