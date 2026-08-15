import { UserProfile, UserId, Achievement } from '../types';

export const USER_PROFILES: Record<UserId, UserProfile> = {
  anna: {
    id: 'anna',
    name: 'Anna',
    password: 'annanation',
    career: 'Derecho & Ciencias Jurídicas',
    semester: '5to Semestre',
    avatarEmoji: '🌹',
    bio: 'Disciplina jurídica, argumentación sólida, justicia y oratoria forense con excelencia.',
    theme: {
      name: 'Anna',
      themeId: 'gothic_crimson',
      themeName: 'Rojo & Negro Carmesí',
      avatar: '🌹',
      tagline: 'Poder, disciplina y excelencia jurídica 🌹',
      headerTitle: 'BIENVENIDA ANNA',
      headerEmoji: '🌹',
      primaryColor: '#EF4444',
      accentGradient: 'from-red-600 via-rose-600 to-red-950',
      bgGradientOrbs: {
        orb1: 'bg-red-600/35',
        orb2: 'bg-rose-950/50',
        orb3: 'bg-red-900/30',
        orb4: 'bg-amber-600/15',
      },
      cardBorder: 'border-red-500/25 hover:border-red-500/40',
      buttonPrimary: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-800 hover:from-red-700 hover:to-rose-900 text-white shadow-lg shadow-red-600/30',
      badgeAccent: 'bg-red-500/20 text-red-300 border-red-500/30',
      highlightText: 'text-red-400',
      selectionClass: 'selection:bg-red-600 selection:text-white',
    }
  },
  isa: {
    id: 'isa',
    name: 'Isa',
    password: 'ykisartt',
    career: 'Ingeniería Industrial',
    semester: '4to Semestre',
    avatarEmoji: '✨',
    bio: 'Optimización de procesos, logística, gestión de calidad y metas estratégicas.',
    theme: {
      name: 'Isa',
      themeId: 'violet_magic',
      themeName: 'Púrpura, Lavanda & Rosa Astral',
      avatar: '✨',
      tagline: 'Organización mágica, optimización y metas cumplidas ✨',
      headerTitle: 'BIENVENIDA ISA',
      headerEmoji: '✨',
      primaryColor: '#8B5CF6',
      accentGradient: 'from-pink-400 via-purple-400 to-cyan-300',
      bgGradientOrbs: {
        orb1: 'bg-purple-600/25',
        orb2: 'bg-blue-600/20',
        orb3: 'bg-pink-600/20',
        orb4: 'bg-emerald-600/15',
      },
      cardBorder: 'border-purple-500/25 hover:border-purple-500/40',
      buttonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30',
      badgeAccent: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      highlightText: 'text-pink-400',
      selectionClass: 'selection:bg-pink-500 selection:text-white',
    }
  },
  sun: {
    id: 'sun',
    name: 'Sun',
    password: 'swnni3',
    career: 'Ingeniería de Software & Cloud',
    semester: '4to Semestre',
    avatarEmoji: '🌊',
    bio: 'Código limpio, arquitectura de software, nube y victorias de desarrollo.',
    theme: {
      name: 'Sun',
      themeId: 'ocean_marine',
      themeName: 'Colores del Mar (Cyan & Aqua)',
      avatar: '🌊',
      tagline: 'Fluyendo con código, constancia y victorias académicas 🌊',
      headerTitle: 'BIENVENID@ SUN',
      headerEmoji: '🌊',
      primaryColor: '#06B6D4',
      accentGradient: 'from-cyan-400 via-teal-400 to-blue-500',
      bgGradientOrbs: {
        orb1: 'bg-cyan-500/30',
        orb2: 'bg-teal-600/30',
        orb3: 'bg-blue-700/25',
        orb4: 'bg-emerald-500/20',
      },
      cardBorder: 'border-cyan-500/25 hover:border-cyan-500/40',
      buttonPrimary: 'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30',
      badgeAccent: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      highlightText: 'text-cyan-400',
      selectionClass: 'selection:bg-cyan-500 selection:text-white',
    }
  }
};

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'task_slayer',
    title: 'Mata-Tareas Legendaria ⚡',
    description: 'Completar 4 o más tareas académicas del semestre.',
    icon: 'Zap',
    category: 'academico',
    points: 75,
    badgeGradient: 'from-amber-500 to-orange-600',
    condition: (data) => data.completedTasks >= 4,
  },
  {
    id: 'golden_gpa',
    title: 'Promedio de Oro 🎓',
    description: 'Mantener un promedio general ponderado de 4.0 o superior.',
    icon: 'GraduationCap',
    category: 'academico',
    points: 120,
    badgeGradient: 'from-yellow-400 to-amber-600',
    condition: (data) => data.gpa >= 4.0,
  },
  {
    id: 'master_saver',
    title: 'Ahorradora Maestra 💰',
    description: 'Acumular más de $150,000 COP ahorrados en metas activas.',
    icon: 'PiggyBank',
    category: 'ahorro',
    points: 100,
    badgeGradient: 'from-emerald-500 to-teal-600',
    condition: (data) => data.totalSavings >= 150000,
  },
  {
    id: 'flawless_timing',
    title: 'Reina de la Puntualidad ⏱️',
    description: 'Tener cero tareas atrasadas sin entregar.',
    icon: 'CheckCircle2',
    category: 'puntualidad',
    points: 60,
    badgeGradient: 'from-purple-500 to-pink-600',
    condition: (data) => data.overdueTasks === 0 && data.completedTasks > 0,
  },
  {
    id: 'full_academic_load',
    title: 'Carga de Titanes 📚',
    description: 'Inscribir y organizar 4 o más asignaturas en el semestre.',
    icon: 'BookOpen',
    category: 'academico',
    points: 50,
    badgeGradient: 'from-blue-500 to-indigo-600',
    condition: (data) => data.subjectsCount >= 4,
  },
  {
    id: 'unstoppable_streak',
    title: 'Racha Imparable 🔥',
    description: 'Mantener una racha de estudio y registro activo de 3+ días.',
    icon: 'Flame',
    category: 'racha',
    points: 80,
    badgeGradient: 'from-rose-500 to-red-600',
    condition: (data) => data.streakDays >= 3,
  },
  {
    id: 'financial_guru',
    title: 'Doble Meta Cumplida 🎯',
    description: 'Tener al menos 2 metas de ahorro en progreso o completadas.',
    icon: 'Target',
    category: 'ahorro',
    points: 70,
    badgeGradient: 'from-cyan-500 to-teal-600',
    condition: (data) => data.totalSavings > 80000,
  },
  {
    id: 'social_balance',
    title: 'Equilibrio & Vida Universitaria 🌟',
    description: 'Registrar compromisos y eventos para balancear estudio y vida personal.',
    icon: 'Sparkles',
    category: 'social',
    points: 45,
    badgeGradient: 'from-fuchsia-500 to-purple-600',
    condition: (data) => data.completedTasks >= 2,
  }
];

export function getLevelFromXP(xp: number): { level: number; title: string; nextLevelXP: number; progress: number } {
  const levels = [
    { level: 1, title: 'Novata Universitaria', minXP: 0, maxXP: 100 },
    { level: 2, title: 'Estudiante Enfocada', minXP: 100, maxXP: 250 },
    { level: 3, title: 'Estratega del Semestre', minXP: 250, maxXP: 450 },
    { level: 4, title: 'Maestra de Parciales', minXP: 450, maxXP: 700 },
    { level: 5, title: 'Leyenda Académica', minXP: 700, maxXP: 1000 },
    { level: 6, title: 'Genio Imparable 👑', minXP: 1000, maxXP: 1500 },
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    const l = levels[i];
    if (xp >= l.minXP) {
      const range = l.maxXP - l.minXP;
      const current = xp - l.minXP;
      const progress = Math.min(100, Math.round((current / range) * 100));
      return {
        level: l.level,
        title: l.title,
        nextLevelXP: l.maxXP,
        progress,
      };
    }
  }

  return {
    level: 1,
    title: 'Novata Universitaria',
    nextLevelXP: 100,
    progress: Math.min(100, Math.round((xp / 100) * 100)),
  };
}

export const getUserProfile = (userId: UserId): UserProfile => {
  try {
    const saved = localStorage.getItem(`studyflow_profile_${userId}`);
    if (saved) {
      return {
        ...USER_PROFILES[userId],
        ...JSON.parse(saved)
      };
    }
  } catch (e) {
    console.error('Error loading custom profile', e);
  }
  return USER_PROFILES[userId] || USER_PROFILES.isa;
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(`studyflow_profile_${profile.id}`, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving custom profile', e);
  }
};

export function authenticateUser(nameOrId: string, passwordAttempt: string): { success: boolean; profile?: UserProfile; error?: string } {
  const normalized = nameOrId.trim().toLowerCase();
  
  let targetId: UserId | null = null;
  if (normalized === 'anna' || normalized === 'ana') targetId = 'anna';
  else if (normalized === 'isa' || normalized === 'isabella') targetId = 'isa';
  else if (normalized === 'sun') targetId = 'sun';

  if (!targetId) {
    return { success: false, error: 'Usuario no reconocido. Elige Anna, Isa o Sun.' };
  }

  const profile = getUserProfile(targetId);
  if (profile.password.trim() === passwordAttempt.trim()) {
    return { success: true, profile };
  }

  return { success: false, error: 'Contraseña incorrecta. Revisa tu clave de acceso.' };
}
