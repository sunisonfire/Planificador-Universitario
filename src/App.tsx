import React, { useState, useEffect } from 'react';
import { 
  Subject, 
  Task, 
  GradeComponent, 
  CalendarEvent, 
  Expense, 
  MonthlyBudget, 
  SavingsGoal, 
  AppNotification,
  UserId,
  UserProfile,
  PomodoroSession
} from './types';
import { 
  STORAGE_KEYS, 
  loadUserData, 
  saveUserData, 
  getInitialUserData,
  resetUserProgress
} from './utils/storage';
import { USER_PROFILES, getUserProfile, saveUserProfile } from './utils/users';
import { NotificationManager } from './utils/notifications';
import { sound } from './utils/audio';

import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TasksView } from './components/TasksView';
import { CalendarView } from './components/CalendarView';
import { StatsGradesView } from './components/StatsGradesView';
import { FinanceView } from './components/FinanceView';
import { SubjectsView } from './components/SubjectsView';
import { AchievementsView } from './components/AchievementsView';
import { PomodoroTimer } from './components/PomodoroTimer';
import { NotificationModal } from './components/NotificationModal';
import { QuickAddModal } from './components/QuickAddModal';
import { LoginView } from './components/LoginView';
import { ResetProgressModal } from './components/ResetProgressModal';
import { EditProfileModal } from './components/EditProfileModal';
import { RotateCcw, Edit3 } from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME_DARK);
    if (saved !== null) return saved === 'true';
    return true; // Default to modern frosted dark mode
  });

  // Authentication State
  const [authenticatedUser, setAuthenticatedUser] = useState<UserProfile | null>(() => {
    const savedUserId = localStorage.getItem(STORAGE_KEYS.AUTH_CURRENT_USER) as UserId | null;
    if (savedUserId && USER_PROFILES[savedUserId]) {
      return getUserProfile(savedUserId);
    }
    return null; // Show login by default or load saved
  });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Active User ID
  const activeUserId: UserId = authenticatedUser ? authenticatedUser.id : 'isa';
  const initialData = getInitialUserData(activeUserId);

  // Core Data States (scoped per user)
  const [subjects, setSubjects] = useState<Subject[]>(() => 
    loadUserData<Subject[]>(activeUserId, 'subjects', initialData.subjects)
  );

  const [tasks, setTasks] = useState<Task[]>(() => 
    loadUserData<Task[]>(activeUserId, 'tasks', initialData.tasks)
  );

  const [grades, setGrades] = useState<GradeComponent[]>(() => 
    loadUserData<GradeComponent[]>(activeUserId, 'grades', initialData.grades)
  );

  const [events, setEvents] = useState<CalendarEvent[]>(() => 
    loadUserData<CalendarEvent[]>(activeUserId, 'events', initialData.events)
  );

  const [expenses, setExpenses] = useState<Expense[]>(() => 
    loadUserData<Expense[]>(activeUserId, 'expenses', initialData.expenses)
  );

  const [budget, setBudget] = useState<MonthlyBudget>(() => 
    loadUserData<MonthlyBudget>(activeUserId, 'budget', initialData.budget)
  );

  const [goals, setGoals] = useState<SavingsGoal[]>(() => 
    loadUserData<SavingsGoal[]>(activeUserId, 'goals', initialData.goals)
  );

  const [notifications, setNotifications] = useState<AppNotification[]>(() => 
    loadUserData<AppNotification[]>(activeUserId, 'notifications', [])
  );

  const [sessions, setSessions] = useState<PomodoroSession[]>(() => 
    loadUserData<PomodoroSession[]>(activeUserId, 'sessions', [])
  );

  const [pomodoroInitialTaskId, setPomodoroInitialTaskId] = useState<string | undefined>(undefined);

  // Push Permission State
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(() => 
    NotificationManager.getPermissionStatus()
  );

  // UI Modal States
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Reset entire user progress data
  const handleResetUserData = (userId: UserId, mode: 'defaults' | 'empty') => {
    resetUserProgress(userId);

    if (mode === 'defaults') {
      const userDefaults = getInitialUserData(userId);
      setSubjects(userDefaults.subjects);
      setTasks(userDefaults.tasks);
      setGrades(userDefaults.grades);
      setEvents(userDefaults.events);
      setExpenses(userDefaults.expenses);
      setBudget(userDefaults.budget);
      setGoals(userDefaults.goals);
      setNotifications([]);
      setSessions([]);

      saveUserData(userId, 'subjects', userDefaults.subjects);
      saveUserData(userId, 'tasks', userDefaults.tasks);
      saveUserData(userId, 'grades', userDefaults.grades);
      saveUserData(userId, 'events', userDefaults.events);
      saveUserData(userId, 'expenses', userDefaults.expenses);
      saveUserData(userId, 'budget', userDefaults.budget);
      saveUserData(userId, 'goals', userDefaults.goals);
      saveUserData(userId, 'notifications', []);
      saveUserData(userId, 'sessions', []);
    } else {
      const emptyBudget: MonthlyBudget = { 
        month: '2026-08', 
        totalBudget: 500000, 
        categoryLimits: {
          comida: 150000,
          transporte: 80000,
          materiales: 50000,
          salidas: 70000,
          ocio: 50000,
          servicios: 30000,
          ahorro: 50000,
          otros: 20000
        }
      };
      setSubjects([]);
      setTasks([]);
      setGrades([]);
      setEvents([]);
      setExpenses([]);
      setBudget(emptyBudget);
      setGoals([]);
      setNotifications([]);
      setSessions([]);

      saveUserData(userId, 'subjects', []);
      saveUserData(userId, 'tasks', []);
      saveUserData(userId, 'grades', []);
      saveUserData(userId, 'events', []);
      saveUserData(userId, 'expenses', []);
      saveUserData(userId, 'budget', emptyBudget);
      saveUserData(userId, 'goals', []);
      saveUserData(userId, 'notifications', []);
      saveUserData(userId, 'sessions', []);
    }

    sound.playSuccess();
  };

  // When active user changes (e.g. login/switch), load their data fresh
  const handleUserLogin = (user: UserProfile) => {
    setAuthenticatedUser(user);
    localStorage.setItem(STORAGE_KEYS.AUTH_CURRENT_USER, user.id);

    const userDefaults = getInitialUserData(user.id);
    setSubjects(loadUserData<Subject[]>(user.id, 'subjects', userDefaults.subjects));
    setTasks(loadUserData<Task[]>(user.id, 'tasks', userDefaults.tasks));
    setGrades(loadUserData<GradeComponent[]>(user.id, 'grades', userDefaults.grades));
    setEvents(loadUserData<CalendarEvent[]>(user.id, 'events', userDefaults.events));
    setExpenses(loadUserData<Expense[]>(user.id, 'expenses', userDefaults.expenses));
    setBudget(loadUserData<MonthlyBudget>(user.id, 'budget', userDefaults.budget));
    setGoals(loadUserData<SavingsGoal[]>(user.id, 'goals', userDefaults.goals));
    setNotifications(loadUserData<AppNotification[]>(user.id, 'notifications', []));
    setSessions(loadUserData<PomodoroSession[]>(user.id, 'sessions', []));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_CURRENT_USER);
    setAuthenticatedUser(null);
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME_DARK, String(darkMode));
  }, [darkMode]);

  // Sync state changes with localStorage for the active user
  useEffect(() => {
    if (authenticatedUser) {
      saveUserData(authenticatedUser.id, 'subjects', subjects);
    }
  }, [subjects, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      saveUserData(authenticatedUser.id, 'tasks', tasks);
    }
  }, [tasks, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      saveUserData(authenticatedUser.id, 'grades', grades);
    }
  }, [grades, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      saveUserData(authenticatedUser.id, 'events', events);
    }
  }, [events, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      saveUserData(authenticatedUser.id, 'expenses', expenses);
    }
  }, [expenses, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      saveUserData(authenticatedUser.id, 'budget', budget);
    }
  }, [budget, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      saveUserData(authenticatedUser.id, 'goals', goals);
    }
  }, [goals, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      saveUserData(authenticatedUser.id, 'notifications', notifications);
    }
  }, [notifications, authenticatedUser]);

  useEffect(() => {
    if (authenticatedUser) {
      saveUserData(authenticatedUser.id, 'sessions', sessions);
    }
  }, [sessions, authenticatedUser]);

  // Scan for upcoming tasks on load / task change and send alerts if needed
  useEffect(() => {
    if (!authenticatedUser) return;
    const upcomingAlerts = NotificationManager.checkUpcomingTasks(tasks, subjects);
    if (upcomingAlerts.length > 0) {
      setNotifications(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newOnes = upcomingAlerts.filter(a => !existingIds.has(a.id));
        return [...newOnes, ...prev];
      });
    }
  }, [tasks, subjects, authenticatedUser]);

  // Request browser Web Push notification permission
  const handleRequestPushPermission = async () => {
    const permission = await NotificationManager.requestPermission();
    setPushPermission(permission);
    if (permission === 'granted' && authenticatedUser) {
      sound.playSuccess();
      NotificationManager.sendPushNotification(`🎉 ¡Notificaciones activadas para ${authenticatedUser.name}!`, {
        body: 'Te avisaremos oportunamente cuando tus entregas estén a menos de 3 días.',
      });
    }
  };

  // Task Handlers
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [task, ...prev]);

    const urgency = NotificationManager.isDueSoon(task.dueDate);
    if (urgency.isDue && authenticatedUser) {
      NotificationManager.sendPushNotification(`🚨 Tarea urgente de ${authenticatedUser.name}: ${task.title}`, {
        body: `Entrega fijada para ${task.dueDate} a las ${task.dueTime}`,
      });
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completada' ? 'pendiente' : 'completada';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Grade Handlers
  const handleAddGrade = (newGrade: Omit<GradeComponent, 'id'>) => {
    const grade: GradeComponent = {
      ...newGrade,
      id: `grd-${Date.now()}`,
    };
    setGrades(prev => [...prev, grade]);
  };

  const handleUpdateGrade = (updatedGrade: GradeComponent) => {
    setGrades(prev => prev.map(g => g.id === updatedGrade.id ? updatedGrade : g));
  };

  const handleDeleteGrade = (gradeId: string) => {
    setGrades(prev => prev.filter(g => g.id !== gradeId));
  };

  // Event Handlers
  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setEvents(prev => [...prev, event]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // Expense Handlers
  const handleAddExpense = (newExp: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExp,
      id: `exp-${Date.now()}`,
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const handleDeleteExpense = (expId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expId));
  };

  const handleUpdateBudget = (newBudget: MonthlyBudget) => {
    setBudget(newBudget);
  };

  // Goal Handlers
  const handleAddGoal = (newGoal: Omit<SavingsGoal, 'id'>) => {
    const goal: SavingsGoal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
    };
    setGoals(prev => [...prev, goal]);
  };

  const handleUpdateGoal = (updatedGoal: SavingsGoal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  // Subject Handlers
  const handleAddSubject = (newSub: Omit<Subject, 'id'>) => {
    const subject: Subject = {
      ...newSub,
      id: `sub-${Date.now()}`,
    };
    setSubjects(prev => [...prev, subject]);
  };

  const handleUpdateSubject = (updatedSub: Subject) => {
    setSubjects(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
  };

  const handleDeleteSubject = (subId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subId));
  };

  const handleSaveUserProfile = (updatedProfile: UserProfile) => {
    setAuthenticatedUser(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  // Count urgent tasks (< 3 days and not completed)
  const urgentTaskCount = tasks.filter(t => {
    if (t.status === 'completada') return false;
    return NotificationManager.isDueSoon(t.dueDate).isDue;
  }).length;

  const handleQuickAddSelection = (action: 'task' | 'event' | 'expense' | 'subject') => {
    setIsQuickAddOpen(false);
    if (action === 'task') setActiveTab('tasks');
    else if (action === 'event') setActiveTab('calendar');
    else if (action === 'expense') setActiveTab('finance');
    else if (action === 'subject') setActiveTab('subjects');
  };

  // If no user is logged in, show Login Screen
  if (!authenticatedUser) {
    return (
      <LoginView
        onLoginSuccess={handleUserLogin}
        defaultUserId="isa"
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    );
  }

  const themeOrbs = authenticatedUser.theme.bgGradientOrbs;

  return (
    <div className={`relative min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} selection:bg-pink-500 selection:text-white transition-colors duration-300 overflow-x-hidden font-sans antialiased`}>
      {/* Frosted Glass Dynamic Ambient Glowing Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-32 -left-32 w-[550px] h-[550px] ${themeOrbs.orb1} rounded-full ${darkMode ? 'blur-[140px] opacity-70' : 'blur-[120px] opacity-35'} transition-all duration-700`} />
        <div className={`absolute top-1/4 -right-32 w-[600px] h-[600px] ${themeOrbs.orb2} rounded-full ${darkMode ? 'blur-[160px] opacity-70' : 'blur-[130px] opacity-35'} transition-all duration-700`} />
        <div className={`absolute bottom-10 left-1/3 w-[500px] h-[500px] ${themeOrbs.orb3} rounded-full ${darkMode ? 'blur-[150px] opacity-70' : 'blur-[120px] opacity-35'} transition-all duration-700`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-5 lg:p-8">
        {/* Main Header with User Welcome & Theme Controls */}
        <Header
          currentUser={authenticatedUser}
          onSwitchUser={handleLogout}
          onLogout={handleLogout}
          onEditProfile={() => setIsEditProfileOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          notifications={notifications}
          onOpenNotifications={() => setIsNotificationModalOpen(true)}
          onQuickAdd={() => setIsQuickAddOpen(true)}
          onRequestPushPermission={handleRequestPushPermission}
          pushPermission={pushPermission}
        />

        {/* Tab Navigation with Achievement Tab and User Accents */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          urgentTaskCount={urgentTaskCount}
          currentUser={authenticatedUser}
        />

        {/* Tab Views */}
        <main className="transition-all duration-300">
          {activeTab === 'dashboard' && (
            <Dashboard
              subjects={subjects}
              tasks={tasks}
              grades={grades}
              events={events}
              expenses={expenses}
              budget={budget}
              goals={goals}
              currentUser={authenticatedUser}
              onToggleTaskStatus={handleToggleTaskStatus}
              onNavigateTab={setActiveTab}
              onOpenTaskModal={() => setActiveTab('tasks')}
              onOpenEventModal={() => setActiveTab('calendar')}
              onOpenExpenseModal={() => setActiveTab('finance')}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              subjects={subjects}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleTaskStatus={handleToggleTaskStatus}
              onStartPomodoro={(taskId) => {
                setPomodoroInitialTaskId(taskId);
                setActiveTab('pomodoro');
              }}
            />
          )}

          {activeTab === 'pomodoro' && (
            <PomodoroTimer
              tasks={tasks}
              subjects={subjects}
              currentUser={authenticatedUser}
              sessions={sessions}
              initialTaskId={pomodoroInitialTaskId}
              onUpdateTask={handleUpdateTask}
              onAddSession={(session) => {
                setSessions(prev => [session, ...prev]);
              }}
              onClearSessions={() => setSessions([])}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              events={events}
              subjects={subjects}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {activeTab === 'grades' && (
            <StatsGradesView
              subjects={subjects}
              grades={grades}
              onAddGrade={handleAddGrade}
              onUpdateGrade={handleUpdateGrade}
              onDeleteGrade={handleDeleteGrade}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView
              expenses={expenses}
              budget={budget}
              goals={goals}
              currentUser={authenticatedUser}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              onUpdateBudget={handleUpdateBudget}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {activeTab === 'subjects' && (
            <SubjectsView
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
              onSelectSubjectForGrades={(subId) => {
                setActiveTab('grades');
              }}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              currentUser={authenticatedUser}
              onOpenResetModal={() => setIsResetModalOpen(true)}
            />
          )}
        </main>

        {/* Modals */}
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
          }}
          onClearNotifications={() => setNotifications([])}
          onRequestPushPermission={handleRequestPushPermission}
          pushPermission={pushPermission}
          tasks={tasks}
          subjects={subjects}
        />

        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          onSelectAction={handleQuickAddSelection}
        />

        <ResetProgressModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          user={authenticatedUser}
          onConfirmReset={handleResetUserData}
        />

        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          currentUser={authenticatedUser}
          onSaveProfile={handleSaveUserProfile}
        />

        {/* User Profile & Progress Management Footer at Bottom of Profile */}
        <footer className="mt-12 p-5 rounded-3xl bg-white/80 dark:bg-slate-900/75 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-xl shadow-sm">
              {authenticatedUser.avatarEmoji}
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>{authenticatedUser.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                  {authenticatedUser.career}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Semestre {authenticatedUser.semester} • {darkMode ? '🌙 Modo Oscuro Activado' : '☀️ Modo Claro Activado'}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Edit profile and semester button at bottom of active profile */}
            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                setIsEditProfileOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 font-extrabold text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
              title="Editar Semestre, Carrera o Datos de este Perfil"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Semestre / Perfil</span>
            </button>

            {/* Reset button at bottom of active profile */}
            <button
              type="button"
              onClick={() => {
                sound.playAlert();
                setIsResetModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-extrabold text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
              title="Resetear todo el progreso guardado de este perfil"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetear Progreso de {authenticatedUser.name}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold text-xs transition-all"
            >
              Cambiar de Perfil
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
