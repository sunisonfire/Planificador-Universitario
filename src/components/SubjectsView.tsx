import React, { useState } from 'react';
import { 
  Subject 
} from '../types';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  GraduationCap,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/audio';

interface SubjectsViewProps {
  subjects: Subject[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onSelectSubjectForGrades: (subjectId: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onSelectSubjectForGrades,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formProfessor, setFormProfessor] = useState('');
  const [formClassroom, setFormClassroom] = useState('');
  const [formCredits, setFormCredits] = useState(3);
  const [formColor, setFormColor] = useState('#8B5CF6');
  const [formPassingGrade, setFormPassingGrade] = useState(3.0);
  const [formScaleMax, setFormScaleMax] = useState(5.0);
  const [formSchedules, setFormSchedules] = useState<Subject['schedule']>([
    { day: 'Lunes', startTime: '08:00', endTime: '10:00', location: '' }
  ]);

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormName('');
    setFormCode('');
    setFormProfessor('');
    setFormClassroom('');
    setFormCredits(3);
    setFormColor('#EC4899');
    setFormPassingGrade(3.0);
    setFormScaleMax(5.0);
    setFormSchedules([
      { day: 'Lunes', startTime: '08:00', endTime: '10:00', location: '' }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setFormName(sub.name);
    setFormCode(sub.code || '');
    setFormProfessor(sub.professor);
    setFormClassroom(sub.classroom || '');
    setFormCredits(sub.credits);
    setFormColor(sub.color);
    setFormPassingGrade(sub.passingGrade);
    setFormScaleMax(sub.scaleMax || 5.0);
    setFormSchedules(sub.schedule || []);
    setIsModalOpen(true);
  };

  const handleAddScheduleItem = () => {
    setFormSchedules([
      ...formSchedules,
      { day: 'Miércoles', startTime: '10:00', endTime: '12:00', location: '' }
    ]);
  };

  const handleRemoveScheduleItem = (index: number) => {
    setFormSchedules(formSchedules.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index: number, field: keyof Subject['schedule'][0], value: string) => {
    const updated = [...formSchedules];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setFormSchedules(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formProfessor.trim()) return;

    if (editingSubject) {
      onUpdateSubject({
        ...editingSubject,
        name: formName.trim(),
        code: formCode.trim() || undefined,
        professor: formProfessor.trim(),
        classroom: formClassroom.trim() || undefined,
        credits: Number(formCredits),
        color: formColor,
        textColor: '#FFFFFF',
        icon: 'BookOpen',
        passingGrade: Number(formPassingGrade),
        scaleMax: Number(formScaleMax),
        schedule: formSchedules,
      });
      sound.playSuccess();
    } else {
      onAddSubject({
        name: formName.trim(),
        code: formCode.trim() || undefined,
        professor: formProfessor.trim(),
        classroom: formClassroom.trim() || undefined,
        credits: Number(formCredits),
        color: formColor,
        textColor: '#FFFFFF',
        icon: 'BookOpen',
        passingGrade: Number(formPassingGrade),
        scaleMax: Number(formScaleMax),
        schedule: formSchedules,
      });
      sound.playSuccess();
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
            <span>Mis Materias Universitarias</span>
            <span className="text-xl">📚✨</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Gestiona tus asignaturas inscritas, profesores, salones y horarios semanales
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Inscribir Materia</span>
        </button>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl hover:border-white/25 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md border border-white/20"
                    style={{ backgroundColor: sub.color }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {sub.name}
                    </h3>
                    <span className="text-xs font-bold text-slate-300">
                      {sub.code || 'Sin código'} • {sub.credits} Créditos
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(sub)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 transition-colors"
                    title="Editar materia"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      sound.playAlert();
                      onDeleteSubject(sub.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                    title="Eliminar materia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Professor & Classroom */}
              <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-200">{sub.professor}</span>
                </div>
                {sub.classroom && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{sub.classroom}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-purple-300 font-semibold">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span>Nota mínima para pasar: {sub.passingGrade.toFixed(1)} / {sub.scaleMax.toFixed(1)}</span>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Horario de Clases
                </div>
                {sub.schedule && sub.schedule.length > 0 ? (
                  <div className="space-y-1">
                    {sub.schedule.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-white/5 border border-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg"
                      >
                        <span className="font-bold text-white">{item.day}</span>
                        <span className="text-slate-300 font-medium">
                          {item.startTime} - {item.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Sin horario definido</p>
                )}
              </div>
            </div>

            {/* Action button: Go to Grades Calculator for this subject */}
            <button
              onClick={() => onSelectSubjectForGrades(sub.id)}
              className="w-full py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-purple-500/30 backdrop-blur-md"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ver Notas & Calculadora</span>
            </button>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Subject */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-white font-['Outfit']">
                {editingSubject ? 'Editar Materia' : 'Inscribir Nueva Materia'}
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
                  Nombre de la Materia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cálculo Multivariado, Programación Web..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Código de Asignatura
                  </label>
                  <input
                    type="text"
                    placeholder="MAT-201"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:ring-2 focus:ring-purple-500 placeholder-slate-400 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Créditos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formCredits}
                    onChange={(e) => setFormCredits(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:ring-2 focus:ring-purple-500 backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Docente / Profesor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dra. Sofía Valenzuela"
                    value={formProfessor}
                    onChange={(e) => setFormProfessor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:ring-2 focus:ring-purple-500 placeholder-slate-400 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Salón / Laboratorio
                  </label>
                  <input
                    type="text"
                    placeholder="Edificio B - Aula 304"
                    value={formClassroom}
                    onChange={(e) => setFormClassroom(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-400 backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Color Distintivo
                  </label>
                  <input
                    type="color"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full h-8 rounded-xl cursor-pointer bg-white/5 border border-white/15 p-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nota para Pasar
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formPassingGrade}
                    onChange={(e) => setFormPassingGrade(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Escala Máxima
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formScaleMax}
                    onChange={(e) => setFormScaleMax(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
                  />
                </div>
              </div>

              {/* Schedule editor */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Días y Horarios de Clase
                  </label>
                  <button
                    type="button"
                    onClick={handleAddScheduleItem}
                    className="text-xs font-bold text-purple-300 hover:underline"
                  >
                    + Agregar Día
                  </button>
                </div>

                {formSchedules.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={item.day}
                      onChange={(e) => handleScheduleChange(idx, 'day', e.target.value as any)}
                      className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs text-white"
                    >
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => (
                        <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                      ))}
                    </select>

                    <input
                      type="time"
                      value={item.startTime}
                      onChange={(e) => handleScheduleChange(idx, 'startTime', e.target.value)}
                      className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs text-white"
                    />
                    <span className="text-slate-400 text-xs">-</span>
                    <input
                      type="time"
                      value={item.endTime}
                      onChange={(e) => handleScheduleChange(idx, 'endTime', e.target.value)}
                      className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs text-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveScheduleItem(idx)}
                      className="text-rose-400 hover:text-rose-300 text-xs font-bold p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-purple-500/25"
                >
                  {editingSubject ? 'Guardar Cambios' : 'Inscribir Materia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
