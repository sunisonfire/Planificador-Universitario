import React, { useState, useEffect } from 'react';
import { 
  Subject, 
  GradeComponent 
} from '../types';
import { 
  Calculator, 
  GraduationCap, 
  TrendingUp, 
  Award, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Sliders, 
  BookOpen,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StatsGradesViewProps {
  subjects: Subject[];
  grades: GradeComponent[];
  onAddGrade: (grade: Omit<GradeComponent, 'id'>) => void;
  onUpdateGrade: (grade: GradeComponent) => void;
  onDeleteGrade: (gradeId: string) => void;
}

export const StatsGradesView: React.FC<StatsGradesViewProps> = ({
  subjects,
  grades,
  onAddGrade,
  onUpdateGrade,
  onDeleteGrade,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [simulatedPendingScore, setSimulatedPendingScore] = useState<number>(3.5);

  useEffect(() => {
    if (!subjects.some(s => s.id === selectedSubjectId)) {
      setSelectedSubjectId(subjects[0]?.id || '');
    }
  }, [subjects, selectedSubjectId]);

  // Modal for Adding/Editing Grade Component
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeComponent | null>(null);
  const [formName, setFormName] = useState('');
  const [formPercentage, setFormPercentage] = useState(25);
  const [formScore, setFormScore] = useState<string>('4.0');
  const [formIsCompleted, setFormIsCompleted] = useState(true);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Calculations for current subject
  const currentSubjectGrades = grades.filter(g => g.subjectId === currentSubject?.id);
  const totalPercentageDefined = currentSubjectGrades.reduce((sum, g) => sum + g.percentage, 0);

  const completedGrades = currentSubjectGrades.filter(g => g.isCompleted && g.score !== undefined);
  const completedPercentage = completedGrades.reduce((sum, g) => sum + g.percentage, 0);

  // Current accumulated points (out of scaleMax)
  const currentAccumulatedPoints = completedGrades.reduce(
    (sum, g) => sum + ((g.score || 0) * (g.percentage / 100)),
    0
  );

  const remainingPercentage = Math.max(0, 100 - completedPercentage);
  const passingGrade = currentSubject?.passingGrade || 3.0;
  const scaleMax = currentSubject?.scaleMax || 5.0;

  // Points needed to reach passingGrade
  const pointsNeededToPass = Math.max(0, passingGrade - currentAccumulatedPoints);

  // Required score on remaining % to pass
  let requiredScoreOnRemaining = 0;
  let isAlreadyPassed = currentAccumulatedPoints >= passingGrade;
  let isImpossibleToPass = false;

  if (!isAlreadyPassed && remainingPercentage > 0) {
    requiredScoreOnRemaining = (pointsNeededToPass / (remainingPercentage / 100));
    if (requiredScoreOnRemaining > scaleMax) {
      isImpossibleToPass = true;
    }
  }

  // Simulated Final Grade
  const simulatedPoints = (simulatedPendingScore * (remainingPercentage / 100));
  const simulatedFinalGrade = currentAccumulatedPoints + simulatedPoints;

  // Global Semester GPA
  let totalCredits = 0;
  let weightedGPASum = 0;

  subjects.forEach(sub => {
    const subGrades = grades.filter(g => g.subjectId === sub.id && g.isCompleted && g.score !== undefined);
    if (subGrades.length > 0) {
      let subWeight = 0;
      let subAccum = 0;
      subGrades.forEach(g => {
        subWeight += g.percentage;
        subAccum += (g.score || 0) * (g.percentage / 100);
      });
      if (subWeight > 0) {
        const subProjected = (subAccum / subWeight) * 100;
        weightedGPASum += subProjected * sub.credits;
        totalCredits += sub.credits;
      }
    }
  });

  const semesterGPA = totalCredits > 0 ? (weightedGPASum / totalCredits) : 0.0;

  const openCreateModal = () => {
    setEditingGrade(null);
    setFormName('');
    setFormPercentage(20);
    setFormScore('4.0');
    setFormIsCompleted(true);
    setIsModalOpen(true);
  };

  const openEditModal = (grade: GradeComponent) => {
    setEditingGrade(grade);
    setFormName(grade.name);
    setFormPercentage(grade.percentage);
    setFormScore(grade.score !== undefined ? String(grade.score) : '');
    setFormIsCompleted(grade.isCompleted);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !currentSubject) return;

    const parsedScore = formIsCompleted && formScore !== '' ? parseFloat(formScore) : undefined;

    if (editingGrade) {
      onUpdateGrade({
        ...editingGrade,
        name: formName.trim(),
        percentage: Number(formPercentage),
        score: parsedScore,
        isCompleted: formIsCompleted,
      });
      sound.playSuccess();
    } else {
      onAddGrade({
        subjectId: currentSubject.id,
        name: formName.trim(),
        percentage: Number(formPercentage),
        score: parsedScore,
        isCompleted: formIsCompleted,
      });
      sound.playSuccess();
    }

    setIsModalOpen(false);
  };

  const triggerCelebrate = () => {
    sound.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
            <span>Estadísticas & Calculadora Semestral</span>
            <span className="text-xl">🧮</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Simula tus notas para saber cuánto necesitas sacar en los exámenes para pasar cada materia
          </p>
        </div>

        {/* Global GPA Pill */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md">
          <GraduationCap className="w-5 h-5 text-yellow-300" />
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-100">Promedio Ponderado</div>
            <div className="text-lg font-black font-['Outfit']">{semesterGPA.toFixed(2)} / 5.0</div>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      {subjects.length > 0 ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {subjects.map(subject => {
            const isSelected = subject.id === currentSubject?.id;
            return (
              <button
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border backdrop-blur-md ${
                  isSelected
                    ? 'bg-white text-slate-900 border-white shadow-md scale-102'
                    : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
                <span>{subject.name}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-dashed border-white/20 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-purple-400 mx-auto opacity-80" />
          <h3 className="text-base font-bold text-white font-['Outfit']">
            No tienes materias registradas
          </h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Añade tus materias desde el panel de asignaturas para comenzar a calcular notas y promedios.
          </p>
        </div>
      )}

      {/* Main Interactive Passing Calculator Card */}
      {currentSubject && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: currentSubject.color }}
                />
                <h3 className="text-xl font-extrabold text-white font-['Outfit']">
                  {currentSubject.name}
                </h3>
                <span className="text-xs font-bold text-slate-400">({currentSubject.code || 'Materia'})</span>
              </div>
              <p className="text-xs text-slate-300">
                Profesor: {currentSubject.professor} • Créditos: {currentSubject.credits} • Nota mínima para pasar: <strong className="text-purple-300">{passingGrade.toFixed(1)}</strong>
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md self-start lg:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nota / Parcial</span>
            </button>
          </div>

          {/* 3 Result Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Accumulated Score */}
            <div className="p-5 rounded-2xl bg-purple-500/15 border border-purple-500/30 backdrop-blur-md">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                Puntos Acumulados
              </div>
              <div className="text-3xl font-black text-white font-['Outfit'] mb-1">
                {currentAccumulatedPoints.toFixed(2)}
                <span className="text-sm font-semibold text-purple-300"> / {passingGrade.toFixed(1)}</span>
              </div>
              <div className="text-xs text-purple-200">
                Has completado el <strong>{completedPercentage}%</strong> del semestre
              </div>
            </div>

            {/* Box 2: Passing Diagnosis (The Core "¿Paso el semestre?" Feature) */}
            <div className={`p-5 rounded-2xl border backdrop-blur-md ${
              isAlreadyPassed
                ? 'bg-emerald-500/15 border-emerald-500/30'
                : isImpossibleToPass
                ? 'bg-rose-500/15 border-rose-500/30'
                : 'bg-amber-500/15 border-amber-500/30'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  ¿Cuánto necesito para pasar?
                </span>
                {isAlreadyPassed && <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />}
              </div>

              {isAlreadyPassed ? (
                <div>
                  <div className="text-2xl font-black text-emerald-300 font-['Outfit'] mb-1">
                    ¡YA PASASTE! 🎉
                  </div>
                  <p className="text-xs text-emerald-200 font-medium">
                    Tus puntos actuales superan la nota mínima de {passingGrade.toFixed(1)}. ¡Todo lo demás sumará a tu promedio!
                  </p>
                </div>
              ) : remainingPercentage === 0 ? (
                <div>
                  <div className="text-2xl font-black text-rose-300 font-['Outfit'] mb-1">
                    Semestre Cerrado
                  </div>
                  <p className="text-xs text-rose-200">
                    Tu nota definitiva fue {currentAccumulatedPoints.toFixed(2)}.
                  </p>
                </div>
              ) : isImpossibleToPass ? (
                <div>
                  <div className="text-xl font-bold text-rose-300 font-['Outfit'] mb-1">
                    Meta desafiante
                  </div>
                  <p className="text-xs text-rose-200">
                    Se requeriría más del puntaje máximo ({scaleMax.toFixed(1)}) en el {remainingPercentage}% restante.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-black text-amber-300 font-['Outfit'] mb-1">
                    {requiredScoreOnRemaining.toFixed(2)}
                    <span className="text-xs font-normal text-amber-200"> en el {remainingPercentage}% restante</span>
                  </div>
                  <p className="text-xs text-amber-100">
                    Necesitas promediar <strong>{requiredScoreOnRemaining.toFixed(2)}</strong> en las notas faltantes para pasar con {passingGrade.toFixed(1)}.
                  </p>
                </div>
              )}
            </div>

            {/* Box 3: What-if Simulator */}
            <div className="p-5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 backdrop-blur-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Simulador de Nota Final
                </span>
                <Sliders className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="text-3xl font-black text-white font-['Outfit'] mb-1">
                {simulatedFinalGrade.toFixed(2)}
                <span className="text-xs font-semibold text-cyan-300"> proyectada</span>
              </div>

              {/* Interactive slider for simulating score */}
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-[11px] font-bold text-cyan-200">
                  <span>Si sacas en lo restante:</span>
                  <span className="text-cyan-300 bg-cyan-900/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {simulatedPendingScore.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5.0"
                  step="0.1"
                  value={simulatedPendingScore}
                  onChange={(e) => setSimulatedPendingScore(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Grade Components Table / Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white font-['Outfit']">
                Cortes y Evaluaciones Registradas ({totalPercentageDefined}% / 100%)
              </h4>
              {totalPercentageDefined !== 100 && (
                <span className="text-xs text-amber-300 font-medium">
                  ⚠️ Falta definir el {100 - totalPercentageDefined}% para completar el 100%
                </span>
              )}
            </div>

            <div className="space-y-2">
              {currentSubjectGrades.map((grade) => (
                <div
                  key={grade.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl text-white ${grade.isCompleted ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                      {grade.isCompleted ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {grade.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                          {grade.percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {grade.isCompleted ? 'Calificado' : 'Pendiente por calificar'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-black font-['Outfit'] text-white">
                        {grade.score !== undefined ? `${grade.score.toFixed(1)}` : '—'}
                      </div>
                      {grade.score !== undefined && (
                        <div className="text-[10px] text-slate-400">
                          Aporta: {((grade.score * grade.percentage) / 100).toFixed(2)} pts
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(grade)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-purple-300 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          sound.playAlert();
                          onDeleteGrade(grade.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary Table of All Subjects */}
      <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white font-['Outfit']">
          Resumen General de Materias del Semestre
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(sub => {
            const subGrades = grades.filter(g => g.subjectId === sub.id && g.isCompleted && g.score !== undefined);
            let subCompletedPct = 0;
            let subAccumPoints = 0;
            subGrades.forEach(g => {
              subCompletedPct += g.percentage;
              subAccumPoints += (g.score || 0) * (g.percentage / 100);
            });

            const hasPassingAccum = subAccumPoints >= sub.passingGrade;

            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className="cursor-pointer p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 backdrop-blur-md transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }} />
                    <span className="text-sm font-bold text-white truncate max-w-[150px]">
                      {sub.name}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    hasPassingAccum 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {hasPassingAccum ? 'Aprobada ✅' : 'En curso ⚡'}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-xs text-slate-300">
                  <span>Puntos acumulados:</span>
                  <span className="text-sm font-extrabold text-white">
                    {subAccumPoints.toFixed(2)} / {sub.scaleMax.toFixed(1)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (subAccumPoints / sub.scaleMax) * 100)}%`,
                      backgroundColor: sub.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Add / Edit Grade */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {editingGrade ? 'Editar Componente de Nota' : 'Agregar Componente de Nota'}
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
                  Nombre de la Evaluación / Parcial *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Parcial 1, Taller 2, Quiz..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Porcentaje del Semestre (%) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formPercentage}
                  onChange={(e) => setFormPercentage(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 backdrop-blur-md"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCompletedCheck"
                  checked={formIsCompleted}
                  onChange={(e) => setFormIsCompleted(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <label htmlFor="isCompletedCheck" className="text-xs font-bold text-slate-300">
                  ¿Ya fue calificado y tienes la nota?
                </label>
              </div>

              {formIsCompleted && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nota Obtenida (0.0 - 5.0) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5.0"
                    required
                    value={formScore}
                    onChange={(e) => setFormScore(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 backdrop-blur-md"
                  />
                </div>
              )}

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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-purple-500/30"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
