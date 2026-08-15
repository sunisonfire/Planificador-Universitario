import React, { useState } from 'react';
import { 
  Task, 
  Subject, 
  Priority, 
  TaskStatus 
} from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Trash2, 
  Edit3, 
  Bell, 
  BookOpen, 
  Check, 
  Sparkles,
  Percent,
  Timer
} from 'lucide-react';
import { NotificationManager } from '../utils/notifications';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TasksViewProps {
  tasks: Task[];
  subjects: Subject[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onStartPomodoro?: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  subjects,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTaskStatus,
  onStartPomodoro,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [urgencyOnly, setUrgencyOnly] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formDueTime, setFormDueTime] = useState('23:59');
  const [formPriority, setFormPriority] = useState<Priority>('media');
  const [formStatus, setFormStatus] = useState<TaskStatus>('pendiente');
  const [formWeight, setFormWeight] = useState<number>(10);
  const [formReminder, setFormReminder] = useState<Task['reminderOption']>('1day');

  const openCreateModal = () => {
    setEditingTask(null);
    setFormTitle('');
    setFormSubjectId(subjects[0]?.id || '');
    setFormDescription('');
    
    // Default due date tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormDueDate(tomorrow.toISOString().split('T')[0]);
    setFormDueTime('23:59');
    setFormPriority('media');
    setFormStatus('pendiente');
    setFormWeight(15);
    setFormReminder('1day');
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormSubjectId(task.subjectId);
    setFormDescription(task.description || '');
    setFormDueDate(task.dueDate);
    setFormDueTime(task.dueTime || '23:59');
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormWeight(task.weightPercentage || 10);
    setFormReminder(task.reminderOption || '1day');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSubjectId || !formDueDate) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: formTitle.trim(),
        subjectId: formSubjectId,
        description: formDescription.trim(),
        dueDate: formDueDate,
        dueTime: formDueTime,
        priority: formPriority,
        status: formStatus,
        weightPercentage: Number(formWeight),
        reminderOption: formReminder,
      });
      sound.playSuccess();
    } else {
      onAddTask({
        title: formTitle.trim(),
        subjectId: formSubjectId,
        description: formDescription.trim(),
        dueDate: formDueDate,
        dueTime: formDueTime,
        priority: formPriority,
        status: formStatus,
        weightPercentage: Number(formWeight),
        reminderOption: formReminder,
      });
      sound.playSuccess();
    }
    setIsModalOpen(false);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubjectId === 'all' || task.subjectId === selectedSubjectId;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    if (urgencyOnly) {
      const urgency = NotificationManager.isDueSoon(task.dueDate);
      if (!urgency.isDue || task.status === 'completada') return false;
    }

    return matchesSearch && matchesSubject && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
            <span>Tareas & Entregas Académicas</span>
            <span className="text-xl">📝</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Control de deberes por materia, fechas límites y recordatorios de entrega
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Agregar Nueva Tarea</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título o detalle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 backdrop-blur-md"
            />
          </div>

          {/* Subject selector */}
          <div className="md:col-span-3">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-md"
            >
              <option value="all" className="bg-slate-900 text-white">Todas las materias ({subjects.length})</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.name}</option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white backdrop-blur-md"
            >
              <option value="all" className="bg-slate-900 text-white">Todos los estados</option>
              <option value="pendiente" className="bg-slate-900 text-white">Pendientes</option>
              <option value="en_progreso" className="bg-slate-900 text-white">En progreso</option>
              <option value="completada" className="bg-slate-900 text-white">Completadas</option>
            </select>
          </div>

          {/* Urgency Pill Button (<3 days) */}
          <div className="md:col-span-2 flex items-center">
            <button
              onClick={() => setUrgencyOnly(!urgencyOnly)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border backdrop-blur-md ${
                urgencyOnly
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                  : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${urgencyOnly ? 'text-white' : 'text-rose-400'}`} />
              <span>&lt; 3 días</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const subject = subjects.find(s => s.id === task.subjectId);
            const urgency = NotificationManager.isDueSoon(task.dueDate);
            const isCompleted = task.status === 'completada';

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-white/5 opacity-60 bg-slate-900/40'
                    : urgency.isDue
                    ? 'border-rose-500/40 bg-slate-900/70'
                    : 'border-white/15 hover:border-purple-400/50'
                }`}
              >
                {/* Left Side: Checkbox, Subject pill, Title, Description */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isCompleted) {
                        sound.playSuccess();
                        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                      }
                      onToggleTaskStatus(task.id);
                    }}
                    className={`mt-1 w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-transform active:scale-90 shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-slate-400 hover:border-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      {/* Subject Tag */}
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold text-white shadow-xs"
                        style={{ backgroundColor: subject?.color || '#8B5CF6' }}
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>{subject?.name || 'Materia'}</span>
                      </span>

                      {/* Urgency Badge if not completed */}
                      {!isCompleted && urgency.isDue && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          urgency.isOverdue 
                            ? 'bg-red-600 text-white animate-pulse' 
                            : urgency.daysLeft === 0
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {urgency.label}
                        </span>
                      )}

                      {/* Priority Tag */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${
                        task.priority === 'alta'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : task.priority === 'media'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-white/10 text-slate-300 border-white/10'
                      }`}>
                        {task.priority}
                      </span>

                      {/* Weight % */}
                      {task.weightPercentage && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
                          <span>{task.weightPercentage}% de nota</span>
                        </span>
                      )}

                      {/* Study Minutes / Pomodoro Progress */}
                      {task.studyMinutes && task.studyMinutes > 0 ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Timer className="w-3 h-3 text-amber-400" />
                          <span>{task.studyMinutes}m enfocados</span>
                        </span>
                      ) : null}
                    </div>

                    {/* Task Title */}
                    <h3 className={`text-base font-bold transition-all ${
                      isCompleted 
                        ? 'line-through text-slate-400' 
                        : 'text-white'
                    }`}>
                      {task.title}
                    </h3>

                    {/* Description */}
                    {task.description && (
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Due Date, Reminder info, Pomodoro action, Edit & Delete */}
                <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                  <div className="text-left md:text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>{task.dueDate} • {task.dueTime || '23:59'}</span>
                    </div>
                    {task.reminderOption !== 'none' && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <Bell className="w-2.5 h-2.5" />
                        <span>Aviso: {task.reminderOption}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onStartPomodoro && !isCompleted && (
                      <button
                        onClick={() => onStartPomodoro(task.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                        title="Iniciar sesión Pomodoro con esta tarea"
                      >
                        <Timer className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Pomodoro</span>
                      </button>
                    )}

                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 rounded-xl text-slate-300 hover:text-purple-300 hover:bg-purple-500/20 transition-colors"
                      title="Editar tarea"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        sound.playAlert();
                        onDeleteTask(task.id);
                      }}
                      className="p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Eliminar tarea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/15 shadow-xl">
            <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">
              No se encontraron tareas con estos filtros
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              Prueba a cambiar tus filtros de búsqueda o agrega una nueva tarea universitaria.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
            >
              + Agregar Tarea
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-white font-['Outfit']">
                {editingTask ? 'Editar Tarea' : 'Nueva Tarea / Entrega'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Título de la Tarea / Proyecto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Taller de derivadas o Proyecto Final..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Materia correspondiente *
                </label>
                <select
                  required
                  value={formSubjectId}
                  onChange={(e) => setFormSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 backdrop-blur-md"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.name} ({s.code || 'Sin código'})</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Descripción o Instrucciones
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre entregable, rúbrica, formato PDF, etc."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              {/* Due Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Fecha de Entrega *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Hora Límite
                  </label>
                  <input
                    type="time"
                    value={formDueTime}
                    onChange={(e) => setFormDueTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 backdrop-blur-md"
                  />
                </div>
              </div>

              {/* Priority, Weight % & Reminder */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  >
                    <option value="baja" className="bg-slate-900 text-white">Baja</option>
                    <option value="media" className="bg-slate-900 text-white">Media</option>
                    <option value="alta" className="bg-slate-900 text-white">Alta 🚨</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Ponderación %
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formWeight}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Recordatorio
                  </label>
                  <select
                    value={formReminder}
                    onChange={(e) => setFormReminder(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  >
                    <option value="none" className="bg-slate-900 text-white">Sin alerta</option>
                    <option value="1h" className="bg-slate-900 text-white">1 hora antes</option>
                    <option value="1day" className="bg-slate-900 text-white">1 día antes</option>
                    <option value="2days" className="bg-slate-900 text-white">2 días antes</option>
                    <option value="3days" className="bg-slate-900 text-white">3 días antes</option>
                  </select>
                </div>
              </div>

              {/* Status if editing */}
              {editingTask && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Estado de avance
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white backdrop-blur-md"
                  >
                    <option value="pendiente" className="bg-slate-900 text-white">Pendiente</option>
                    <option value="en_progreso" className="bg-slate-900 text-white">En progreso ⚡</option>
                    <option value="completada" className="bg-slate-900 text-white">Completada ✅</option>
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold shadow-lg shadow-purple-500/30"
                >
                  {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
