import React, { useState } from 'react';
import { 
  CalendarEvent, 
  EventCategory, 
  Subject 
} from '../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Trash2, 
  Sparkles, 
  Coffee, 
  GraduationCap, 
  Heart, 
  PartyPopper, 
  Dumbbell,
  Filter
} from 'lucide-react';
import { sound } from '../utils/audio';

interface CalendarViewProps {
  events: CalendarEvent[];
  subjects: Subject[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  subjects,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventCategory>('all');
  const [selectedDayEvents, setSelectedDayEvents] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<EventCategory>('salida');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formStartTime, setFormStartTime] = useState('18:00');
  const [formEndTime, setFormEndTime] = useState('21:00');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formColor, setFormColor] = useState('#EC4899'); // Default pink

  // Category visual metadata
  const categoryMeta: Record<EventCategory, { label: string; icon: any; color: string }> = {
    salida: { label: 'Salida con amigos 🍹🍕', icon: Coffee, color: '#EC4899' },
    social: { label: 'Social & Cumpleaños 🎂', icon: PartyPopper, color: '#F59E0B' },
    academico: { label: 'Académico / Estudio 📚', icon: GraduationCap, color: '#8B5CF6' },
    examen: { label: 'Examen / Parcial 📝', icon: GraduationCap, color: '#EF4444' },
    personal: { label: 'Personal & Bienestar 🌸', icon: Heart, color: '#06B6D4' },
    deporte: { label: 'Deporte & Fitness 🧘‍♀️', icon: Dumbbell, color: '#10B981' },
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const openCreateModal = (presetDate?: string, presetCat: EventCategory = 'salida') => {
    setFormTitle('');
    setFormCategory(presetCat);
    setFormDate(presetDate || new Date().toISOString().split('T')[0]);
    setFormStartTime('18:00');
    setFormEndTime('21:00');
    setFormLocation('');
    setFormDescription('');
    setFormColor(categoryMeta[presetCat].color);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;

    onAddEvent({
      title: formTitle.trim(),
      category: formCategory,
      date: formDate,
      startTime: formStartTime,
      endTime: formEndTime,
      location: formLocation.trim() || undefined,
      description: formDescription.trim() || undefined,
      color: formColor,
    });

    sound.playSuccess();
    setIsModalOpen(false);
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    return true;
  });

  const getEventsForDay = (day: number) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter(e => e.date === dayStr);
  };

  // Build calendar matrix
  const calendarCells = [];
  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      dateStr: `${year}-${String(month).padStart(2, '0')}-${String(prevMonthDays - i).padStart(2, '0')}`,
    });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
      events: getEventsForDay(d),
    });
  }
  // Next month leading days to complete grid
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      dateStr: `${year}-${String(month + 2).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
            <span>Calendario de Eventos & Salidas</span>
            <span className="text-xl">📅🍹</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Planifica tus salidas con amigos, citas de estudio, parciales y eventos especiales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreateModal(undefined, 'salida')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <Coffee className="w-4 h-4" />
            <span>+ Programar Salida</span>
          </button>
          <button
            onClick={() => openCreateModal(undefined, 'academico')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Evento Académico</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border backdrop-blur-md ${
            selectedCategory === 'all'
              ? 'bg-white text-slate-900 border-white shadow-md'
              : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
          }`}
        >
          Todos los eventos ({events.length})
        </button>

        {Object.entries(categoryMeta).map(([catKey, meta]) => {
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey as EventCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border backdrop-blur-md ${
                isSelected
                  ? 'text-white shadow-md'
                  : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
              }`}
              style={{
                backgroundColor: isSelected ? meta.color : undefined,
                borderColor: isSelected ? meta.color : undefined,
              }}
            >
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Month Grid Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl">
        {/* Month Navigation Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/15"
            >
              Hoy
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-white/15 hover:bg-white/10 text-white transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-white/15 hover:bg-white/10 text-white transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {daysOfWeek.map((dayName) => (
            <div key={dayName} className="text-xs font-bold text-slate-300 uppercase tracking-wider py-1">
              {dayName}
            </div>
          ))}
        </div>

        {/* 7x6 Day Cells Matrix */}
        <div className="grid grid-cols-7 gap-2">
          {calendarCells.map((cell, idx) => {
            const isToday = cell.dateStr === todayStr;
            const isSelected = selectedDayEvents === cell.dateStr;
            const cellEvents = cell.events || [];

            return (
              <div
                key={idx}
                onClick={() => {
                  if (cell.isCurrentMonth) {
                    setSelectedDayEvents(isSelected ? null : cell.dateStr);
                  }
                }}
                className={`min-h-[90px] sm:min-h-[110px] p-2 rounded-2xl border transition-all flex flex-col justify-between backdrop-blur-md ${
                  !cell.isCurrentMonth
                    ? 'opacity-25 bg-white/5 border-white/5 cursor-default'
                    : isSelected
                    ? 'border-pink-400 bg-pink-500/20 shadow-lg ring-2 ring-pink-400/60'
                    : isToday
                    ? 'border-purple-400 bg-purple-500/20 shadow-sm'
                    : 'bg-white/5 border-white/10 hover:border-pink-400/40 hover:bg-white/10 cursor-pointer'
                }`}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday 
                      ? 'bg-purple-600 text-white font-black shadow-sm' 
                      : 'text-slate-200'
                  }`}>
                    {cell.day}
                  </span>

                  {cell.isCurrentMonth && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreateModal(cell.dateStr, 'salida');
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-slate-400 hover:text-pink-300 text-xs font-bold"
                      title="Agregar evento este día"
                    >
                      +
                    </button>
                  )}
                </div>

                {/* Event Tags inside cell */}
                <div className="space-y-1 overflow-hidden flex-1">
                  {cellEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white truncate shadow-xs flex items-center gap-1"
                      style={{ backgroundColor: ev.color || '#EC4899' }}
                    >
                      <span className="truncate">{ev.title}</span>
                    </div>
                  ))}

                  {cellEvents.length > 2 && (
                    <div className="text-[9px] font-black text-slate-300 pl-1">
                      +{cellEvents.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day / Upcoming Events List */}
      <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/20 backdrop-blur-md text-pink-300 border border-pink-500/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                {selectedDayEvents 
                  ? `Eventos del día (${selectedDayEvents})` 
                  : 'Próximos Eventos & Salidas Programadas'}
              </h3>
              <p className="text-xs text-slate-300">
                {selectedDayEvents ? 'Detalle de actividades para la fecha seleccionada' : 'Agenda de salidas y compromisos'}
              </p>
            </div>
          </div>

          {selectedDayEvents && (
            <button
              onClick={() => setSelectedDayEvents(null)}
              className="text-xs font-bold text-pink-400 hover:text-pink-300 hover:underline"
            >
              Ver todos los eventos
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(selectedDayEvents 
            ? filteredEvents.filter(e => e.date === selectedDayEvents) 
            : filteredEvents.slice(0, 6)
          ).map((ev) => {
            const meta = categoryMeta[ev.category] || categoryMeta.salida;
            const Icon = meta.icon;

            return (
              <div
                key={ev.id}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-400/40 backdrop-blur-md flex flex-col justify-between gap-2.5 shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-xs"
                      style={{ backgroundColor: ev.color || meta.color }}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{meta.label.split(' ')[0]}</span>
                    </span>

                    <button
                      onClick={() => {
                        sound.playAlert();
                        onDeleteEvent(ev.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                      title="Eliminar evento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-2">
                    {ev.title}
                  </h4>

                  {ev.description && (
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {ev.description}
                    </p>
                  )}
                </div>

                <div className="space-y-1 pt-2 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    <span>{ev.date} • {ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ''}</span>
                  </div>

                  {ev.location && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Add Event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-white font-['Outfit']">
                Programar Evento o Salida ✨
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nombre del Evento / Salida *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Tarde de café con Vale, Cine, Parcial de Cálculo..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-pink-500 placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tipo de Actividad
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const cat = e.target.value as EventCategory;
                      setFormCategory(cat);
                      setFormColor(categoryMeta[cat].color);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  >
                    <option value="salida" className="bg-slate-900 text-white">🍹 Salida con amigos</option>
                    <option value="social" className="bg-slate-900 text-white">🎂 Social / Cumpleaños</option>
                    <option value="academico" className="bg-slate-900 text-white">📚 Académico / Estudio</option>
                    <option value="examen" className="bg-slate-900 text-white">📝 Examen / Parcial</option>
                    <option value="personal" className="bg-slate-900 text-white">🌸 Personal / Bienestar</option>
                    <option value="deporte" className="bg-slate-900 text-white">🧘‍♀️ Deporte / Gym</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Color del Evento
                  </label>
                  <input
                    type="color"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full h-10 rounded-xl cursor-pointer bg-white/5 border border-white/15 p-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Lugar / Ubicación
                </label>
                <input
                  type="text"
                  placeholder="Ej. Starbucks Campus, Mall Plaza, Aula 304..."
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Notas o Amigos que van
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Llevar ropa cómoda, invitar a Sofi y Vale..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-bold shadow-lg shadow-pink-500/25"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
