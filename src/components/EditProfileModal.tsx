import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Sparkles, GraduationCap, BookOpen, Smile, AlignLeft, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

const SEMESTER_PRESETS = [
  '1er Semestre',
  '2do Semestre',
  '3er Semestre',
  '4to Semestre',
  '5to Semestre',
  '6to Semestre',
  '7mo Semestre',
  '8vo Semestre',
  '9no Semestre',
  '10mo Semestre',
  'Posgrado / Maestría',
  'Graduad@',
];

const EMOJI_OPTIONS = [
  '✨', '🌹', '🌊', '🌸', '⚡', '📚', '💼', '🎯', '🧪', '💻', '🎓', '🚀', '👑', '🔥', '🎨', '🌟', '🏆', '💡'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [career, setCareer] = useState(currentUser.career);
  const [semester, setSemester] = useState(currentUser.semester);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarEmoji, setAvatarEmoji] = useState(currentUser.avatarEmoji);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !career.trim() || !semester.trim()) return;

    const updated: UserProfile = {
      ...currentUser,
      name: name.trim(),
      career: career.trim(),
      semester: semester.trim(),
      bio: bio.trim(),
      avatarEmoji,
      theme: {
        ...currentUser.theme,
        avatar: avatarEmoji,
        headerEmoji: avatarEmoji,
      }
    };

    onSaveProfile(updated);
    sound.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <span>Editar Perfil & Semestre</span>
                <span className="text-base">{avatarEmoji}</span>
              </h3>
              <p className="text-xs text-slate-300">
                Personaliza tu información académica y semestre actual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Emoji Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-pink-400" />
              <span>Icono / Emoji de Perfil</span>
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 bg-white/5 rounded-2xl border border-white/10">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    avatarEmoji === emoji
                      ? 'bg-purple-500 text-white ring-2 ring-purple-300 scale-110 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Nombre o Apodo *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-purple-500 placeholder-slate-400 backdrop-blur-md"
            />
          </div>

          {/* Career */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Carrera Universitaria *</span>
            </label>
            <input
              type="text"
              required
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              placeholder="Ej. Ingeniería Industrial, Derecho, Medicina, etc."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-blue-500 placeholder-slate-400 backdrop-blur-md"
            />
          </div>

          {/* Semester Selector & Custom */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Semestre Actual *</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">Seleccionado: {semester}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SEMESTER_PRESETS.map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => setSemester(sem)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border text-left truncate flex items-center justify-between ${
                    semester === sem
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-sm'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span className="truncate">{sem}</span>
                  {semester === sem && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <input
                type="text"
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="O escribe tu semestre personalizado (ej. 4to Semestre)"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 backdrop-blur-md"
              />
            </div>
          </div>

          {/* Bio / Quote */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Lema o Meta de Estudio</span>
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Escribe tu frase de enfoque o metas del periodo..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:ring-2 focus:ring-amber-500 placeholder-slate-400 backdrop-blur-md resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition-transform active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
