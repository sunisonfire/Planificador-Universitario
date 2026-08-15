export type UserId = 'anna' | 'isa' | 'sun';

export interface UserThemeConfig {
  name: string;
  themeId: string;
  themeName: string;
  avatar: string;
  tagline: string;
  headerTitle: string;
  headerEmoji: string;
  primaryColor: string; // e.g. red-500, purple-500, cyan-500
  accentGradient: string; // Tailwind gradient classes
  bgGradientOrbs: {
    orb1: string;
    orb2: string;
    orb3: string;
    orb4: string;
  };
  cardBorder: string;
  buttonPrimary: string;
  badgeAccent: string;
  highlightText: string;
  selectionClass: string;
}

export interface UserProfile {
  id: UserId;
  name: string;
  password: string; // 'annanation' | 'ykisartt' | 'swnni3'
  career: string;
  semester: string;
  avatarEmoji: string;
  theme: UserThemeConfig;
  bio: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'academico' | 'ahorro' | 'puntualidad' | 'racha' | 'social';
  points: number; // XP points granted
  badgeGradient: string;
  condition: (data: {
    completedTasks: number;
    gpa: number;
    totalSavings: number;
    streakDays: number;
    subjectsCount: number;
    overdueTasks: number;
  }) => boolean;
}

export interface UserLeaderboardStats {
  userId: UserId;
  userName: string;
  career: string;
  avatarEmoji: string;
  theme: UserThemeConfig;
  totalXP: number;
  level: number;
  levelTitle: string;
  completedTasks: number;
  totalTasks: number;
  gpa: number;
  totalSavings: number;
  subjectsCount: number;
  unlockedAchievements: string[];
  streakDays: number;
  rank?: number;
}

export type Priority = 'baja' | 'media' | 'alta';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  professor: string;
  classroom?: string;
  credits: number;
  color: string; // Hex or Tailwind color class identifier
  textColor: string;
  icon: string;
  passingGrade: number; // e.g., 3.0 on 0-5 scale or 6.0 on 0-10 or 60 on 0-100
  scaleMax: number; // usually 5, 10 or 100
  schedule: {
    day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';
    startTime: string;
    endTime: string;
    location?: string;
  }[];
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  priority: Priority;
  status: TaskStatus;
  weightPercentage?: number; // % in the semester grade, e.g. 15%
  grade?: number; // Grade obtained once graded
  reminderOption: 'none' | '1h' | '1day' | '2days' | '3days';
  notified?: boolean;
  createdAt: string;
  studyMinutes?: number; // Minutes tracked studying for this task
  pomodoroGoal?: number; // Estimated pomodoros goal
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  subjectId?: string;
  durationMinutes: number;
  timestamp: string;
  mode: 'pomodoro' | 'short_break' | 'long_break';
}

export interface GradeComponent {
  id: string;
  subjectId: string;
  name: string; // e.g. "Parcial 1", "Taller 1", "Examen Final"
  percentage: number; // 0 - 100
  score?: number; // Score obtained (null if pending)
  isCompleted: boolean;
}

export type EventCategory = 'salida' | 'academico' | 'social' | 'personal' | 'examen' | 'deporte';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime?: string;
  category: EventCategory;
  color: string;
  location?: string;
  subjectId?: string; // Optional link to a subject
  reminder?: boolean;
}

export type ExpenseCategory = 
  | 'comida' 
  | 'transporte' 
  | 'materiales' 
  | 'salidas' 
  | 'ocio' 
  | 'servicios' 
  | 'ahorro' 
  | 'otros';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  notes?: string;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  totalBudget: number;
  categoryLimits: Record<ExpenseCategory, number>;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadlineDate?: string;
  category: 'viaje' | 'tecnologia' | 'emergencia' | 'ropa' | 'evento' | 'otro';
  color: string;
  icon: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent_task' | 'event' | 'budget_alert' | 'grade_goal' | 'system';
  read: boolean;
  taskId?: string;
}
