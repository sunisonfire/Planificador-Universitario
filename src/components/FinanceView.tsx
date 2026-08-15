import React, { useState, useEffect } from 'react';
import { 
  Expense, 
  ExpenseCategory, 
  MonthlyBudget, 
  SavingsGoal,
  UserProfile
} from '../types';
import { 
  Wallet, 
  PiggyBank, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Coffee, 
  Bus, 
  BookOpen, 
  Film, 
  Sliders, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FinanceViewProps {
  expenses: Expense[];
  budget: MonthlyBudget;
  goals: SavingsGoal[];
  currentUser?: UserProfile;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (expenseId: string) => void;
  onUpdateBudget: (budget: MonthlyBudget) => void;
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  expenses,
  budget,
  goals,
  currentUser,
  onAddExpense,
  onDeleteExpense,
  onUpdateBudget,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  // Category Metadata
  const categoryMeta: Record<ExpenseCategory, { label: string; icon: any; color: string }> = {
    comida: { label: 'Comida & Cafetería 🍔☕', icon: Coffee, color: '#F59E0B' },
    transporte: { label: 'Transporte & Metro 🚌', icon: Bus, color: '#06B6D4' },
    materiales: { label: 'Materiales & Fotocopias 📚', icon: BookOpen, color: '#8B5CF6' },
    salidas: { label: 'Salidas & Amigos 🍹', icon: Film, color: '#EC4899' },
    ocio: { label: 'Ocio & Entretenimiento 🎮', icon: Film, color: '#F43F5E' },
    servicios: { label: 'Servicios & Universidad 🏢', icon: ShieldCheck, color: '#64748B' },
    ahorro: { label: 'Ahorro / Inversión 💰', icon: PiggyBank, color: '#10B981' },
    otros: { label: 'Otros Gastos 🏷️', icon: DollarSign, color: '#6B7280' },
  };

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(20000);

  // Expense Form
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('comida');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);
  const [expMethod, setExpMethod] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('transferencia');
  const [expNotes, setExpNotes] = useState('');

  // Budget Config Form
  const [budgetTotal, setBudgetTotal] = useState(budget.totalBudget);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<ExpenseCategory, number>>(budget.categoryLimits);

  useEffect(() => {
    setBudgetTotal(budget.totalBudget);
    setCategoryBudgets(budget.categoryLimits);
  }, [budget]);

  // Goal Form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('0');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalColor, setGoalColor] = useState('#06B6D4');

  // Filter
  const [filterCategory, setFilterCategory] = useState<'all' | ExpenseCategory>('all');

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const totalSpentThisMonth = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, budget.totalBudget - totalSpentThisMonth);
  const budgetPct = budget.totalBudget > 0 ? Math.min(100, Math.round((totalSpentThisMonth / budget.totalBudget) * 100)) : 0;

  // Category sums
  const categorySpent: Record<ExpenseCategory, number> = {
    comida: 0,
    transporte: 0,
    materiales: 0,
    salidas: 0,
    ocio: 0,
    servicios: 0,
    ahorro: 0,
    otros: 0,
  };

  currentMonthExpenses.forEach(e => {
    categorySpent[e.category] = (categorySpent[e.category] || 0) + e.amount;
  });

  const formatCurrency = (amt: number) => `$${amt.toLocaleString('es-CO')}`;

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;

    onAddExpense({
      title: expTitle.trim(),
      amount: Number(expAmount),
      category: expCategory,
      date: expDate,
      paymentMethod: expMethod,
      notes: expNotes.trim() || undefined,
    });

    sound.playCoin();
    setIsExpenseModalOpen(false);
    setExpTitle('');
    setExpAmount('');
    setExpNotes('');
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBudget({
      month: currentMonth,
      totalBudget: Number(budgetTotal),
      categoryLimits: categoryBudgets,
    });
    sound.playSuccess();
    setIsBudgetModalOpen(false);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || !goalTarget) return;

    onAddGoal({
      title: goalTitle.trim(),
      targetAmount: Number(goalTarget),
      currentAmount: Number(goalCurrent) || 0,
      deadlineDate: goalDeadline || undefined,
      category: 'viaje',
      color: goalColor,
      icon: 'PiggyBank',
    });

    sound.playSuccess();
    setIsGoalModalOpen(false);
    setGoalTitle('');
    setGoalTarget('');
    setGoalCurrent('0');
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoal || depositAmount <= 0) return;

    const newAmount = depositGoal.currentAmount + depositAmount;
    const isCompletedNow = newAmount >= depositGoal.targetAmount;

    onUpdateGoal({
      ...depositGoal,
      currentAmount: newAmount,
    });

    sound.playCoin();
    if (isCompletedNow) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    setDepositGoal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
            <span>Manejo del Dinero & Metas Financieras</span>
            <span className="text-xl">💰✨</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Seguimiento de gastos diarios, presupuesto mensual y ahorro para tus proyectos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>Configurar Presupuesto</span>
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Gasto</span>
          </button>
        </div>
      </div>

      {/* Top 3 Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Presupuesto Total */}
        <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Presupuesto Mensual</span>
            <span className="p-2 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
              <Wallet className="w-5 h-5 text-emerald-300" />
            </span>
          </div>

          <div>
            <div className="text-3xl font-black font-['Outfit'] text-white">
              {formatCurrency(remainingBudget)}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {budget.totalBudget > 0 ? `Disponible de ${formatCurrency(budget.totalBudget)}` : 'Sin presupuesto definido'}
            </p>
          </div>

          {budget.totalBudget === 0 ? (
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="w-full py-1.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors text-center"
            >
              + Asignar Presupuesto Mensual
            </button>
          ) : (
            <>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ${
                    budgetPct > 85 ? 'bg-rose-400' : 'bg-emerald-400'
                  }"
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-300 font-semibold">
                <span>{budgetPct}% gastado</span>
                <span>{100 - budgetPct}% libre</span>
              </div>
            </>
          )}
        </div>

        {/* Total Gastado este Mes */}
        <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Gastos Este Mes</span>
            <span className="p-2 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-rose-300">
              <TrendingDown className="w-5 h-5" />
            </span>
          </div>

          <div>
            <div className="text-3xl font-black text-white font-['Outfit']">
              {formatCurrency(totalSpentThisMonth)}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentMonthExpenses.length} movimientos registrados
            </p>
          </div>

          <div className="text-xs text-slate-300 font-medium">
            Categoría principal: <strong className="text-pink-400">Comida & Salidas</strong>
          </div>
        </div>

        {/* Total Ahorrado en Metas */}
        <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Ahorro en Metas</span>
            <span className="p-2 rounded-xl bg-purple-500/20 backdrop-blur-md border border-purple-500/30">
              <PiggyBank className="w-5 h-5 text-yellow-300" />
            </span>
          </div>

          <div>
            <div className="text-3xl font-black font-['Outfit'] text-white">
              {formatCurrency(goals.reduce((s, g) => s + g.currentAmount, 0))}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              En {goals.length} metas de ahorro activas
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs text-purple-200 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>¡Excelente hábito financiero{currentUser ? `, ${currentUser.name}` : ''}!</span>
          </div>
        </div>
      </div>

      {/* 🎯 Section: Savings Goals (Metas Financieras) */}
      <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Metas Financieras & Ahorro{currentUser ? ` de ${currentUser.name}` : ''}
              </h3>
              <p className="text-xs text-slate-300">
                Aporta periódicamente para cumplir tus sueños y viajes
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-amber-300 font-bold text-xs transition-colors backdrop-blur-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nueva Meta</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <div
                key={goal.id}
                className={`p-5 rounded-2xl border backdrop-blur-md transition-all flex flex-col justify-between ${
                  isCompleted 
                    ? 'bg-emerald-500/15 border-emerald-500/30' 
                    : 'bg-white/5 border-white/10 hover:border-amber-400/50 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-white line-clamp-2">
                      {goal.title}
                    </h4>
                    <button
                      onClick={() => {
                        sound.playAlert();
                        onDeleteGoal(goal.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {goal.deadlineDate && (
                    <p className="text-[11px] text-slate-400 mb-2">
                      Meta para: {goal.deadlineDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2 mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-white font-['Outfit']">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      {pct}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isCompleted ? '#10B981' : (goal.color || '#F59E0B')
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Meta: {formatCurrency(goal.targetAmount)}</span>
                    <span>Faltan: {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}</span>
                  </div>

                  <button
                    onClick={() => {
                      setDepositGoal(goal);
                      setDepositAmount(25000);
                    }}
                    className="w-full mt-2 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Aportar Ahorro</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Category Budget Progress & Daily Expense Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Category Budget Progress (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Límites de Presupuesto por Categoría
            </h3>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              Editar
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryMeta).map(([catKey, meta]) => {
              const spent = categorySpent[catKey as ExpenseCategory] || 0;
              const limit = budget.categoryLimits[catKey as ExpenseCategory] || 50000;
              const pct = Math.min(100, Math.round((spent / limit) * 100));
              const isOver = spent > limit;

              return (
                <div key={catKey} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{meta.label}</span>
                    <span className={`font-black ${isOver ? 'text-rose-400' : 'text-slate-300'}`}>
                      {formatCurrency(spent)} / {formatCurrency(limit)}
                    </span>
                  </div>

                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? 'bg-rose-500' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Daily Expense Tracker List (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Historial de Gastos Diarios
              </h3>
              <p className="text-xs text-slate-300">
                Registro de consumos universitarios y salidas
              </p>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
            >
              <option value="all" className="bg-slate-900 text-white">Todas las categorías</option>
              {Object.entries(categoryMeta).map(([k, v]) => (
                <option key={k} value={k} className="bg-slate-900 text-white">{v.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {expenses
              .filter(e => filterCategory === 'all' || e.category === filterCategory)
              .map((expense) => {
                const meta = categoryMeta[expense.category] || categoryMeta.otros;
                const Icon = meta.icon;

                return (
                  <div
                    key={expense.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-xl text-white shadow-xs"
                        style={{ backgroundColor: meta.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {expense.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{expense.date}</span>
                          <span>•</span>
                          <span className="capitalize">{expense.paymentMethod}</span>
                          {expense.notes && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[120px]">{expense.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-white font-['Outfit']">
                        -{formatCurrency(expense.amount)}
                      </span>
                      <button
                        onClick={() => {
                          sound.playAlert();
                          onDeleteExpense(expense.id);
                        }}
                        className="text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Modal Add Expense */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Registrar Gasto Universitario 💸
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Concepto del Gasto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Almuerzo campus, Café, Fotocopias, Metro..."
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Monto ($ COP / USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="15000"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  >
                    {Object.entries(categoryMeta).map(([k, v]) => (
                      <option key={k} value={k} className="bg-slate-900 text-white">{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Método de Pago
                  </label>
                  <select
                    value={expMethod}
                    onChange={(e) => setExpMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                  >
                    <option value="transferencia" className="bg-slate-900 text-white">Transferencia (Nequi/Daviplata)</option>
                    <option value="tarjeta" className="bg-slate-900 text-white">Tarjeta Débito/Crédito</option>
                    <option value="efectivo" className="bg-slate-900 text-white">Efectivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Notas Adicionales
                </label>
                <input
                  type="text"
                  placeholder="Detalles..."
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/25"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Configure Budget */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Configurar Presupuesto Mensual ⚙️
              </h3>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBudgetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Presupuesto Total Mensual ($) *
                </label>
                <input
                  type="number"
                  required
                  value={budgetTotal}
                  onChange={(e) => setBudgetTotal(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-emerald-500 backdrop-blur-md"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Límites sugeridos por Categoría ($)
                </label>
                {Object.entries(categoryMeta).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-300 font-medium">{v.label}</span>
                    <input
                      type="number"
                      value={categoryBudgets[k as ExpenseCategory] || 0}
                      onChange={(e) => setCategoryBudgets({
                        ...categoryBudgets,
                        [k]: Number(e.target.value)
                      })}
                      className="w-28 px-2 py-1 rounded-lg bg-white/5 border border-white/15 text-right text-xs text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold"
                >
                  Guardar Presupuesto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Goal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Crear Meta de Ahorro 🎯
              </h3>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nombre de la Meta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Viaje fin de año, Laptop, Concierto..."
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-amber-500 placeholder-slate-400 backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Monto Objetivo ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="500000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white focus:ring-2 focus:ring-amber-500 placeholder-slate-400 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Ahorro Inicial ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-sm text-white backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Fecha Límite Deseada
                </label>
                <input
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white backdrop-blur-md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs font-bold shadow-lg shadow-amber-500/25"
                >
                  Crear Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Deposit into Goal */}
      {depositGoal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Aportar a: {depositGoal.title}
              </h3>
              <button
                onClick={() => setDepositGoal(null)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Monto a Depositar ($)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-base font-bold text-white"
                />
              </div>

              <div className="flex gap-2">
                {[10000, 25000, 50000, 100000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDepositAmount(val)}
                    className="flex-1 py-1 rounded-lg bg-white/10 text-[10px] font-bold text-slate-200 hover:bg-amber-500/30 border border-white/10"
                  >
                    +${(val/1000)}k
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositGoal(null)}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 text-xs font-bold hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xs font-bold shadow-md"
                >
                  Añadir al Ahorro 🎉
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
