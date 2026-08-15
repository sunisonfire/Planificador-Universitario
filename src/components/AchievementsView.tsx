import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Sparkles, 
  Zap, 
  GraduationCap, 
  PiggyBank, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Target, 
  ArrowUpRight,
  TrendingUp,
  Award,
  Star,
  Users,
  ShieldCheck,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { UserId, UserProfile, UserLeaderboardStats } from '../types';
import { ACHIEVEMENTS_LIST, getLevelFromXP } from '../utils/users';
import { getAllUsersLeaderboard } from '../utils/storage';
import { sound } from '../utils/audio';

interface AchievementsViewProps {
  currentUser: UserProfile;
  onOpenResetModal?: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  currentUser,
  onOpenResetModal
}) => {
  const leaderboard = getAllUsersLeaderboard();
  const currentStats = leaderboard.find(l => l.userId === currentUser.id) || leaderboard[0];
  const levelInfo = getLevelFromXP(currentStats.totalXP);

  const [activeTab, setActiveTab] = useState<'ranking' | 'badges' | 'compare'>('ranking');

  // Find 1st, 2nd, 3rd place users
  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return Zap;
      case 'GraduationCap': return GraduationCap;
      case 'PiggyBank': return PiggyBank;
      case 'CheckCircle2': return CheckCircle2;
      case 'BookOpen': return BookOpen;
      case 'Flame': return Flame;
      case 'Target': return Target;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Liga Universitaria */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-slate-900/65 backdrop-blur-2xl border border-white/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
              <span>Liga de Rendimiento Académico & Logros</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Outfit'] text-white">
              Competencia entre Amigas ✨
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Compite amistosamente con <strong className="text-red-400">Anna</strong>, <strong className="text-pink-400">Isa</strong> y <strong className="text-cyan-400">Sun</strong>. Completa tareas, sube tus calificaciones, ahorra para tus metas y desbloquea trofeos exclusivos.
            </p>
          </div>

          {/* User XP & Level Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md min-w-[260px] space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentUser.avatarEmoji}</span>
                <div>
                  <h4 className="font-extrabold text-white text-sm leading-tight">
                    {currentUser.name}
                  </h4>
                  <span className="text-[11px] text-amber-400 font-bold">
                    Nivel {levelInfo.level} • {levelInfo.title}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-500/20 text-yellow-300 border border-amber-500/30 shadow-sm">
                {currentStats.totalXP} XP
              </span>
            </div>

            {/* XP Progress bar */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                <span>Progreso de Nivel</span>
                <span>{levelInfo.progress}% hacia Nivel {levelInfo.level + 1}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 transition-all duration-500 shadow-sm"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subnavigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => {
            sound.playSuccess();
            setActiveTab('ranking');
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'ranking'
              ? 'bg-amber-500/20 text-yellow-300 border border-amber-500/40 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Crown className="w-4 h-4 text-yellow-400" />
          <span>Podio & Ranking General</span>
        </button>

        <button
          onClick={() => {
            sound.playSuccess();
            setActiveTab('badges');
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'badges'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>Trofeos & Medallas ({currentStats.unlockedAchievements.length}/{ACHIEVEMENTS_LIST.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playSuccess();
            setActiveTab('compare');
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'compare'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Comparativa Cara a Cara</span>
        </button>
      </div>

      {/* VIEW: RANKING & PODIUM */}
      {activeTab === 'ranking' && (
        <div className="space-y-6">
          {/* 3D-Style Visual Podium */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/15 shadow-xl">
            <h3 className="text-lg font-black text-white font-['Outfit'] mb-6 flex items-center gap-2 text-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span>Podio de Honor del Semestre</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-end pt-6">
              
              {/* 2ND PLACE */}
              {secondPlace && (
                <div className="order-2 sm:order-1 flex flex-col items-center">
                  <div className="relative mb-3 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 flex items-center justify-center text-3xl shadow-xl border-2 border-slate-300">
                      {secondPlace.avatarEmoji}
                    </div>
                    <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-slate-300 text-slate-950 font-black text-[11px] shadow">
                      🥈 2do Lugar
                    </span>
                  </div>

                  <div className="w-full rounded-2xl bg-white/5 border border-white/15 p-4 text-center space-y-2 backdrop-blur-md">
                    <h4 className="font-extrabold text-white text-base">
                      {secondPlace.userName}
                    </h4>
                    <span className="inline-block text-xs font-black text-slate-300 px-2 py-0.5 rounded-lg bg-white/10">
                      {secondPlace.totalXP} XP
                    </span>
                    <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                      <div>📝 {secondPlace.completedTasks} tareas hechas</div>
                      <div>🎓 Promedio: {secondPlace.gpa.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1ST PLACE (TALLER & GLOWING) */}
              {firstPlace && (
                <div className="order-1 sm:order-2 flex flex-col items-center -mt-4">
                  <div className="relative mb-3 flex flex-col items-center">
                    <Crown className="w-7 h-7 text-yellow-400 animate-bounce mb-1" />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 text-amber-950 flex items-center justify-center text-4xl shadow-2xl ring-4 ring-yellow-400/40 border-2 border-yellow-200">
                      {firstPlace.avatarEmoji}
                    </div>
                    <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-yellow-400 text-yellow-950 font-black text-xs shadow-lg animate-pulse">
                      👑 1er Lugar
                    </span>
                  </div>

                  <div className="w-full rounded-2xl bg-gradient-to-b from-amber-500/20 to-yellow-950/40 border-2 border-yellow-400/50 p-5 text-center space-y-2 backdrop-blur-xl shadow-xl shadow-amber-500/10">
                    <h4 className="font-black text-yellow-200 text-lg">
                      {firstPlace.userName}
                    </h4>
                    <span className="inline-block text-sm font-black text-yellow-300 px-3 py-1 rounded-xl bg-amber-500/30 border border-amber-400/40 shadow-sm">
                      {firstPlace.totalXP} XP 🌟
                    </span>
                    <div className="text-xs text-slate-200 space-y-1 pt-1 font-medium">
                      <div>📝 {firstPlace.completedTasks} tareas completadas</div>
                      <div>🎓 Promedio Imbatible: {firstPlace.gpa.toFixed(1)}</div>
                      <div>💰 ${firstPlace.totalSavings.toLocaleString('es-CO')} ahorrados</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3RD PLACE */}
              {thirdPlace && (
                <div className="order-3 sm:order-3 flex flex-col items-center">
                  <div className="relative mb-3 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center text-3xl shadow-xl border-2 border-amber-600">
                      {thirdPlace.avatarEmoji}
                    </div>
                    <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-amber-600 text-amber-100 font-black text-[11px] shadow">
                      🥉 3er Lugar
                    </span>
                  </div>

                  <div className="w-full rounded-2xl bg-white/5 border border-white/15 p-4 text-center space-y-2 backdrop-blur-md">
                    <h4 className="font-extrabold text-white text-base">
                      {thirdPlace.userName}
                    </h4>
                    <span className="inline-block text-xs font-black text-slate-300 px-2 py-0.5 rounded-lg bg-white/10">
                      {thirdPlace.totalXP} XP
                    </span>
                    <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                      <div>📝 {thirdPlace.completedTasks} tareas hechas</div>
                      <div>🎓 Promedio: {thirdPlace.gpa.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Leaderboard Table */}
          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/15 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-white font-['Outfit'] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Tabla de Posiciones Oficial</span>
            </h3>

            <div className="space-y-3">
              {leaderboard.map((user, idx) => {
                const isMe = user.userId === currentUser.id;
                return (
                  <div
                    key={user.userId}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isMe 
                        ? 'bg-white/10 border-white/30 shadow-lg ring-1 ring-white/20' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                        idx === 0 ? 'bg-yellow-400 text-yellow-950 shadow-md' :
                        idx === 1 ? 'bg-slate-300 text-slate-950' :
                        'bg-amber-700 text-white'
                      }`}>
                        #{idx + 1}
                      </span>

                      <span className="text-2xl">{user.avatarEmoji}</span>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-base">
                            {user.userName}
                          </h4>
                          {isMe && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold border border-purple-500/40">
                              Tú ✨
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300">
                          {user.career}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-slate-300 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                      <div className="text-center">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Tareas</span>
                        <span className="font-bold text-white">{user.completedTasks}/{user.totalTasks}</span>
                      </div>

                      <div className="text-center">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Promedio</span>
                        <span className="font-bold text-emerald-400">{user.gpa.toFixed(1)}</span>
                      </div>

                      <div className="text-center">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">Ahorro</span>
                        <span className="font-bold text-cyan-400">${(user.totalSavings / 1000).toFixed(0)}k</span>
                      </div>

                      <div className="text-right pl-2">
                        <span className="text-sm font-black text-yellow-400 block">{user.totalXP} XP</span>
                        <span className="text-[10px] text-slate-400">Nivel {user.level}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: BADGES & TROPHIES */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">
                Muro de Trofeos de {currentUser.name}
              </h3>
              <p className="text-xs text-slate-300">
                Desbloquea medallas cumpliendo metas académicas y financieras
              </p>
            </div>

            <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {currentStats.unlockedAchievements.length} de {ACHIEVEMENTS_LIST.length} Desbloqueados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS_LIST.map((ach) => {
              const isUnlocked = currentStats.unlockedAchievements.includes(ach.id);
              const Icon = getBadgeIcon(ach.icon);

              return (
                <div
                  key={ach.id}
                  className={`p-5 rounded-3xl border transition-all relative overflow-hidden backdrop-blur-xl ${
                    isUnlocked
                      ? 'bg-slate-900/70 border-white/25 shadow-xl hover:border-white/40'
                      : 'bg-slate-900/40 border-white/10 opacity-60 grayscale hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-2xl text-white shadow-lg shrink-0 ${
                      isUnlocked 
                        ? `bg-gradient-to-r ${ach.badgeGradient} shadow-amber-500/20` 
                        : 'bg-slate-800'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-extrabold text-white truncate">
                          {ach.title}
                        </h4>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-yellow-300 border border-amber-500/30 shrink-0">
                          +{ach.points} XP
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {ach.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                        {isUnlocked ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ¡Completado y Desbloqueado!
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1">
                            🔒 Aún por desbloquear
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: COMPARE HEAD-TO-HEAD */}
      {activeTab === 'compare' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/15 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-white font-['Outfit']">
              Comparativa Cara a Cara: Anna vs. Isa vs. Sun
            </h3>
            <p className="text-xs text-slate-300">
              Analiza cómo van las estadísticas de cada una durante el semestre
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/15 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Indicador</th>
                  <th className="py-3 px-4 text-center text-red-400 font-extrabold">🌹 Anna</th>
                  <th className="py-3 px-4 text-center text-purple-400 font-extrabold">✨ Isa</th>
                  <th className="py-3 px-4 text-center text-cyan-400 font-extrabold">🌊 Sun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-200">
                {(() => {
                  const anna = leaderboard.find(l => l.userId === 'anna') || leaderboard[0];
                  const isa = leaderboard.find(l => l.userId === 'isa') || leaderboard[0];
                  const sun = leaderboard.find(l => l.userId === 'sun') || leaderboard[0];

                  return (
                    <>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">🏆 Puntos XP Totales</td>
                        <td className="py-3 px-4 text-center font-black text-red-300">{anna.totalXP} XP</td>
                        <td className="py-3 px-4 text-center font-black text-purple-300">{isa.totalXP} XP</td>
                        <td className="py-3 px-4 text-center font-black text-cyan-300">{sun.totalXP} XP</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">⭐ Nivel Universitario</td>
                        <td className="py-3 px-4 text-center font-bold">Nivel {anna.level}</td>
                        <td className="py-3 px-4 text-center font-bold">Nivel {isa.level}</td>
                        <td className="py-3 px-4 text-center font-bold">Nivel {sun.level}</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">📝 Tareas Realizadas</td>
                        <td className="py-3 px-4 text-center font-bold">{anna.completedTasks} / {anna.totalTasks}</td>
                        <td className="py-3 px-4 text-center font-bold">{isa.completedTasks} / {isa.totalTasks}</td>
                        <td className="py-3 px-4 text-center font-bold">{sun.completedTasks} / {sun.totalTasks}</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">🎓 Promedio de Notas (GPA)</td>
                        <td className="py-3 px-4 text-center font-black text-emerald-400">{anna.gpa.toFixed(1)} / 5.0</td>
                        <td className="py-3 px-4 text-center font-black text-emerald-400">{isa.gpa.toFixed(1)} / 5.0</td>
                        <td className="py-3 px-4 text-center font-black text-emerald-400">{sun.gpa.toFixed(1)} / 5.0</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">💰 Ahorro en Metas</td>
                        <td className="py-3 px-4 text-center font-bold">${anna.totalSavings.toLocaleString('es-CO')}</td>
                        <td className="py-3 px-4 text-center font-bold">${isa.totalSavings.toLocaleString('es-CO')}</td>
                        <td className="py-3 px-4 text-center font-bold">${sun.totalSavings.toLocaleString('es-CO')}</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">📚 Materias Inscritas</td>
                        <td className="py-3 px-4 text-center font-bold">{anna.subjectsCount} asignaturas</td>
                        <td className="py-3 px-4 text-center font-bold">{isa.subjectsCount} asignaturas</td>
                        <td className="py-3 px-4 text-center font-bold">{sun.subjectsCount} asignaturas</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">🎖️ Trofeos Desbloqueados</td>
                        <td className="py-3 px-4 text-center font-bold text-yellow-300">{anna.unlockedAchievements.length} medallas</td>
                        <td className="py-3 px-4 text-center font-bold text-yellow-300">{isa.unlockedAchievements.length} medallas</td>
                        <td className="py-3 px-4 text-center font-bold text-yellow-300">{sun.unlockedAchievements.length} medallas</td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ⚙️ Profile Management & Progress Reset Section (At the bottom of user profile) */}
      <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/75 backdrop-blur-2xl border border-white/15 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-white font-['Outfit']">
              Gestión de Datos y Progreso de {currentUser.name}
            </h4>
            <p className="text-xs text-slate-300">
              ¿Deseas reiniciar tus materias, tareas, notas y puntos XP para comenzar un nuevo ciclo o semestre?
            </p>
          </div>
        </div>

        {onOpenResetModal && (
          <button
            type="button"
            onClick={() => {
              sound.playAlert();
              onOpenResetModal();
            }}
            className="shrink-0 px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-extrabold text-xs transition-all active:scale-95 flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Resetear Progreso de {currentUser.name}</span>
          </button>
        )}
      </div>
    </div>
  );
};
