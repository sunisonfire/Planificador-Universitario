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
  UserLeaderboardStats
} from '../types';
import { USER_PROFILES, ACHIEVEMENTS_LIST, getLevelFromXP } from './users';

// Helper to generate dynamic dates relative to today
const getRelativeDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

/* ========================================================
   INITIAL DATA: ISA (Ingeniería Industrial)
   ======================================================== */
export const ISA_INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'isa-sub-1',
    name: 'Investigación de Operaciones I',
    code: 'IND-301',
    professor: 'Dr. Mateo Holguín',
    classroom: 'Edificio Ingenierías - Aula 204',
    credits: 4,
    color: '#8B5CF6',
    textColor: '#FFFFFF',
    icon: 'TrendingUp',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Lunes', startTime: '08:00', endTime: '10:00', location: 'Edificio Ingenierías - Aula 204' },
      { day: 'Miércoles', startTime: '08:00', endTime: '10:00', location: 'Edificio Ingenierías - Aula 204' },
    ]
  },
  {
    id: 'isa-sub-2',
    name: 'Control Estadístico de Calidad & Six Sigma',
    code: 'IND-304',
    professor: 'Dra. Claudia Morales',
    classroom: 'Laboratorio de Metrología & Calidad',
    credits: 3,
    color: '#EC4899',
    textColor: '#FFFFFF',
    icon: 'CheckCircle2',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Martes', startTime: '10:00', endTime: '12:00', location: 'Lab Metrología' },
      { day: 'Jueves', startTime: '10:00', endTime: '12:00', location: 'Lab Metrología' },
    ]
  },
  {
    id: 'isa-sub-3',
    name: 'Logística & Cadenas de Suministro',
    code: 'LOG-205',
    professor: 'Mtro. Javier Restrepo',
    classroom: 'Edificio A - Aula 302',
    credits: 3,
    color: '#F59E0B',
    textColor: '#FFFFFF',
    icon: 'Truck',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Lunes', startTime: '14:00', endTime: '16:00', location: 'Aula 302' },
      { day: 'Viernes', startTime: '09:00', endTime: '11:00', location: 'Aula 302' },
    ]
  },
  {
    id: 'isa-sub-4',
    name: 'Diseño de Procesos & Manufactura',
    code: 'IND-208',
    professor: 'Ing. Andrés Castaño',
    classroom: 'Planta Piloto de Producción',
    credits: 4,
    color: '#10B981',
    textColor: '#FFFFFF',
    icon: 'Cpu',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Miércoles', startTime: '14:00', endTime: '16:00', location: 'Planta Piloto' },
      { day: 'Viernes', startTime: '14:00', endTime: '16:00', location: 'Planta Piloto' },
    ]
  },
  {
    id: 'isa-sub-5',
    name: 'Ingeniería Económica & Finanzas',
    code: 'ECO-302',
    professor: 'Prof. Rodrigo Vega',
    classroom: 'Edificio B - Aula 105',
    credits: 3,
    color: '#06B6D4',
    textColor: '#FFFFFF',
    icon: 'DollarSign',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Jueves', startTime: '16:00', endTime: '18:00', location: 'Edificio B - Aula 105' },
    ]
  }
];

export const ISA_INITIAL_TASKS: Task[] = [
  {
    id: 'isa-task-1',
    subjectId: 'isa-sub-1',
    title: 'Modelado en Programación Lineal y Método Simplex',
    description: 'Formular problema de optimización de inventarios y resolución con Solver.',
    dueDate: getRelativeDate(1),
    dueTime: '23:59',
    priority: 'alta',
    status: 'en_progreso',
    weightPercentage: 20,
    reminderOption: '1day',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'isa-task-2',
    subjectId: 'isa-sub-2',
    title: 'Cartas de Control X-barra y R en Minitab',
    description: 'Analizar estabilidad del proceso de ensamblaje con 30 subgrupos muestreados.',
    dueDate: getRelativeDate(2),
    dueTime: '08:00',
    priority: 'alta',
    status: 'pendiente',
    weightPercentage: 20,
    reminderOption: '2days',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'isa-task-3',
    subjectId: 'isa-sub-3',
    title: 'Estudio de Caso: Rediseño Logístico y Cross-Docking',
    description: 'Diseño de red de distribución y cálculo de stocks de seguridad.',
    dueDate: getRelativeDate(0),
    dueTime: '18:00',
    priority: 'alta',
    status: 'completada',
    weightPercentage: 25,
    reminderOption: '1h',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'isa-task-4',
    subjectId: 'isa-sub-4',
    title: 'Mapeo de Flujo de Valor (VSM) y Balanceo de Línea',
    description: 'Identificar cuellos de botella y reducir tiempos de ciclo en la planta piloto.',
    dueDate: getRelativeDate(4),
    dueTime: '14:00',
    priority: 'media',
    status: 'completada',
    weightPercentage: 20,
    reminderOption: '1day',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'isa-task-5',
    subjectId: 'isa-sub-5',
    title: 'Evaluación Financiera VPN y TIR de Maquinaria CNC',
    description: 'Flujo de caja proyectado a 5 años y análisis de sensibilidad.',
    dueDate: getRelativeDate(6),
    dueTime: '16:00',
    priority: 'baja',
    status: 'completada',
    weightPercentage: 15,
    reminderOption: 'none',
    createdAt: new Date().toISOString(),
  }
];

export const ISA_INITIAL_GRADES: GradeComponent[] = [
  { id: 'isa-grd-1', subjectId: 'isa-sub-1', name: 'Parcial 1 Optimización Lineal', percentage: 25, score: 4.8, isCompleted: true },
  { id: 'isa-grd-2', subjectId: 'isa-sub-2', name: 'Estudio de Capacidad Cp y Cpk', percentage: 20, score: 4.9, isCompleted: true },
  { id: 'isa-grd-3', subjectId: 'isa-sub-3', name: 'Diagnóstico de Cadena de Suministro', percentage: 25, score: 4.7, isCompleted: true },
  { id: 'isa-grd-4', subjectId: 'isa-sub-4', name: 'Proyecto de Manufactura Esbelta', percentage: 30, score: 5.0, isCompleted: true },
  { id: 'isa-grd-5', subjectId: 'isa-sub-5', name: 'Taller de Flujos Descontados', percentage: 20, score: 4.6, isCompleted: true },
];

export const ISA_INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'isa-evt-1', title: 'Tarde de Café & Repaso de Optimización ☕', date: getRelativeDate(0), startTime: '16:30', endTime: '18:30', category: 'salida', color: '#EC4899', location: 'Cafetería Central Campus' },
  { id: 'isa-evt-2', title: 'Visita Técnica Industrial: Centro de Distribución Automatizado 🏭', date: getRelativeDate(1), startTime: '09:00', endTime: '13:00', category: 'academico', color: '#8B5CF6', location: 'Parque Industrial Logístico' },
  { id: 'isa-evt-3', title: 'Salida de Fin de Semana: Cine y Sushi con Amigas 🍣', date: getRelativeDate(3), startTime: '19:00', endTime: '22:30', category: 'social', color: '#F59E0B', location: 'Centro Comercial Plaza' },
  { id: 'isa-evt-4', title: 'Gimnasio & Sesión de Yoga 🧘‍♀️', date: getRelativeDate(2), startTime: '07:00', endTime: '08:00', category: 'deporte', color: '#10B981', location: 'Polideportivo Universitario' }
];

export const ISA_INITIAL_EXPENSES: Expense[] = [
  { id: 'isa-exp-1', title: 'Almuerzo Universidad (Bowl Saludable)', amount: 18000, category: 'comida', date: getRelativeDate(0), paymentMethod: 'transferencia', notes: 'Restaurante del bloque D' },
  { id: 'isa-exp-2', title: 'Recarga Tarjeta Transporte Integrado', amount: 30000, category: 'transporte', date: getRelativeDate(0), paymentMethod: 'transferencia' },
  { id: 'isa-exp-3', title: 'Café Latte & Galleta de Avena', amount: 9500, category: 'comida', date: getRelativeDate(1), paymentMethod: 'tarjeta' },
  { id: 'isa-exp-4', title: 'Cuaderno Profesional & Resaltadores Pastel', amount: 24000, category: 'materiales', date: getRelativeDate(3), paymentMethod: 'efectivo' },
  { id: 'isa-exp-5', title: 'Cine & Palomitas Viernes', amount: 35000, category: 'salidas', date: getRelativeDate(4), paymentMethod: 'tarjeta' },
];

export const ISA_INITIAL_BUDGET: MonthlyBudget = {
  month: '2026-08',
  totalBudget: 450000,
  categoryLimits: {
    comida: 180000,
    transporte: 80000,
    materiales: 50000,
    salidas: 70000,
    ocio: 30000,
    servicios: 20000,
    ahorro: 30000,
    otros: 10000,
  }
};

export const ISA_INITIAL_GOALS: SavingsGoal[] = [
  { id: 'isa-goal-1', title: 'Viaje de Vacaciones a la Playa con Amigos 🏖️', targetAmount: 850000, currentAmount: 540000, deadlineDate: getRelativeDate(45), category: 'viaje', color: '#06B6D4', icon: 'Palmtree' },
  { id: 'isa-goal-2', title: 'iPad Air para análisis de datos y apuntes 📱', targetAmount: 1800000, currentAmount: 1250000, deadlineDate: getRelativeDate(90), category: 'tecnologia', color: '#EC4899', icon: 'Tablet' },
  { id: 'isa-goal-3', title: 'Fondo de Emergencia Estudiantil 🛡️', targetAmount: 300000, currentAmount: 250000, deadlineDate: getRelativeDate(60), category: 'emergencia', color: '#10B981', icon: 'ShieldCheck' },
  { id: 'isa-goal-4', title: 'Certificación Green Belt Six Sigma 📜', targetAmount: 400000, currentAmount: 390000, deadlineDate: getRelativeDate(20), category: 'evento', color: '#8B5CF6', icon: 'Award' }
];


/* ========================================================
   INITIAL DATA: ANNA (Derecho & Ciencias Jurídicas)
   ======================================================== */
export const ANNA_INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'anna-sub-1',
    name: 'Derecho Constitucional Colombiano & Tutela',
    code: 'DER-301',
    professor: 'Dr. Hernando Gómez',
    classroom: 'Aula de Juicios Orales 1',
    credits: 5,
    color: '#EF4444',
    textColor: '#FFFFFF',
    icon: 'Scale',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Lunes', startTime: '07:00', endTime: '09:00', location: 'Aula Juicios Orales 1' },
      { day: 'Miércoles', startTime: '07:00', endTime: '09:00', location: 'Aula Juicios Orales 1' },
    ]
  },
  {
    id: 'anna-sub-2',
    name: 'Derecho Penal General & Teoría del Delito',
    code: 'DER-305',
    professor: 'Dra. Valentina Mendoza',
    classroom: 'Aula Magna de Leyes - 201',
    credits: 4,
    color: '#DC2626',
    textColor: '#FFFFFF',
    icon: 'Gavel',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Martes', startTime: '08:00', endTime: '11:00', location: 'Aula Magna 201' },
      { day: 'Jueves', startTime: '08:00', endTime: '11:00', location: 'Aula Magna 201' },
    ]
  },
  {
    id: 'anna-sub-3',
    name: 'Derecho Civil: Obligaciones & Contratos',
    code: 'DER-202',
    professor: 'Dr. Carlos Arturo Peláez',
    classroom: 'Edificio Jurídico - Aula 203',
    credits: 4,
    color: '#991B1B',
    textColor: '#FFFFFF',
    icon: 'FileText',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Lunes', startTime: '11:00', endTime: '13:00', location: 'Edificio Jurídico 203' },
      { day: 'Viernes', startTime: '08:00', endTime: '10:00', location: 'Edificio Jurídico 203' },
    ]
  },
  {
    id: 'anna-sub-4',
    name: 'Argumentación Jurídica & Oratoria Forense',
    code: 'HUM-204',
    professor: 'Mtra. Natalia Ospina',
    classroom: 'Sala de Debates Jurídicos',
    credits: 3,
    color: '#F97316',
    textColor: '#FFFFFF',
    icon: 'MessageSquare',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Miércoles', startTime: '14:00', endTime: '17:00', location: 'Sala de Debates' },
    ]
  },
  {
    id: 'anna-sub-5',
    name: 'Derecho Procesal General & Litigio Oral',
    code: 'DER-401',
    professor: 'Dr. Camilo Arismendi',
    classroom: 'Sala de Audiencias 2',
    credits: 4,
    color: '#B91C1C',
    textColor: '#FFFFFF',
    icon: 'Shield',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Viernes', startTime: '14:00', endTime: '16:00', location: 'Sala Audiencias 2' },
    ]
  }
];

export const ANNA_INITIAL_TASKS: Task[] = [
  {
    id: 'anna-task-1',
    subjectId: 'anna-sub-1',
    title: 'Redacción de Acción de Tutela por Derecho Fundamental',
    description: 'Estructurar hechos, fundamentos de derecho y medidas cautelares urgentes.',
    dueDate: getRelativeDate(1),
    dueTime: '07:00',
    priority: 'alta',
    status: 'en_progreso',
    weightPercentage: 25,
    reminderOption: '1day',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'anna-task-2',
    subjectId: 'anna-sub-2',
    title: 'Análisis de Caso Penal: Tipicidad, Antijuricidad y Culpabilidad',
    description: 'Resolver caso complejo de dolo eventual vs culpa con representación.',
    dueDate: getRelativeDate(3),
    dueTime: '23:59',
    priority: 'alta',
    status: 'pendiente',
    weightPercentage: 20,
    reminderOption: '2days',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'anna-task-3',
    subjectId: 'anna-sub-3',
    title: 'Minuta Contractual de Compraventa y Cláusula Penal',
    description: 'Redacción de contrato mercantil con condiciones resolutorias expresas.',
    dueDate: getRelativeDate(0),
    dueTime: '20:00',
    priority: 'alta',
    status: 'completada',
    weightPercentage: 20,
    reminderOption: '1h',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'anna-task-4',
    subjectId: 'anna-sub-4',
    title: 'Preparación de Alegato de Conclusión para Juicio Simulado',
    description: 'Construir teoría del caso, oratoria persuasiva y réplica de pruebas.',
    dueDate: getRelativeDate(4),
    dueTime: '17:00',
    priority: 'media',
    status: 'completada',
    weightPercentage: 20,
    reminderOption: '1day',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'anna-task-5',
    subjectId: 'anna-sub-5',
    title: 'Taller de Excepciones Previas y Pruebas en el CGP',
    description: 'Elaboración de contestación de demanda ordinaria civil.',
    dueDate: getRelativeDate(7),
    dueTime: '14:00',
    priority: 'baja',
    status: 'completada',
    weightPercentage: 15,
    reminderOption: 'none',
    createdAt: new Date().toISOString(),
  }
];

export const ANNA_INITIAL_GRADES: GradeComponent[] = [
  { id: 'anna-grd-1', subjectId: 'anna-sub-1', name: 'Sustentación Tutela y Bloque de Constitucionalidad', percentage: 30, score: 4.9, isCompleted: true },
  { id: 'anna-grd-2', subjectId: 'anna-sub-2', name: 'Parcial 1 Teoría del Delito', percentage: 25, score: 4.8, isCompleted: true },
  { id: 'anna-grd-3', subjectId: 'anna-sub-3', name: 'Análisis de Jurisprudencia de la Corte Suprema', percentage: 20, score: 5.0, isCompleted: true },
  { id: 'anna-grd-4', subjectId: 'anna-sub-4', name: 'Debate Forense y Juicio Simulado', percentage: 25, score: 4.9, isCompleted: true },
];

export const ANNA_INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'anna-evt-1', title: 'Audiencia Simulada en Sala de Juicios Orales ⚖️', date: getRelativeDate(0), startTime: '18:00', endTime: '21:00', category: 'academico', color: '#EF4444', location: 'Palacio de Justicia Universitario' },
  { id: 'anna-evt-2', title: 'Conversatorio con Magistrados de la Corte Constitucional 🏛️', date: getRelativeDate(2), startTime: '09:00', endTime: '12:30', category: 'academico', color: '#DC2626', location: 'Auditorio Mayor de Derecho' },
  { id: 'anna-evt-3', title: 'Cena & Brindis con el Grupo de Litigio 🍷', date: getRelativeDate(4), startTime: '20:00', endTime: '23:30', category: 'social', color: '#991B1B', location: 'Restaurante Terraza Gourmet' }
];

export const ANNA_INITIAL_EXPENSES: Expense[] = [
  { id: 'anna-exp-1', title: 'Código General del Proceso y Código Civil Comentado', amount: 85000, category: 'materiales', date: getRelativeDate(0), paymentMethod: 'tarjeta', notes: 'Librería jurídica' },
  { id: 'anna-exp-2', title: 'Suscripción Semestral Base de Datos Legis', amount: 110000, category: 'materiales', date: getRelativeDate(1), paymentMethod: 'transferencia' },
  { id: 'anna-exp-3', title: 'Café Espresso Doble & Snack Nocturno', amount: 12000, category: 'comida', date: getRelativeDate(0), paymentMethod: 'efectivo' },
];

export const ANNA_INITIAL_BUDGET: MonthlyBudget = {
  month: '2026-08',
  totalBudget: 500000,
  categoryLimits: {
    comida: 190000,
    transporte: 90000,
    materiales: 100000,
    salidas: 50000,
    ocio: 30000,
    servicios: 20000,
    ahorro: 20000,
    otros: 0,
  }
};

export const ANNA_INITIAL_GOALS: SavingsGoal[] = [
  { id: 'anna-goal-1', title: 'Traje Formal y Maletín Ejecutivo para Consultorio Jurídico 💼', targetAmount: 750000, currentAmount: 520000, deadlineDate: getRelativeDate(30), category: 'otro', color: '#EF4444', icon: 'Briefcase' },
  { id: 'anna-goal-2', title: 'Congreso Internacional de Derecho Constitucional en Madrid ✈️', targetAmount: 2500000, currentAmount: 1400000, deadlineDate: getRelativeDate(120), category: 'viaje', color: '#991B1B', icon: 'Plane' },
  { id: 'anna-goal-3', title: 'Diplomado en Litigio Estratégico y Arbitraje 📜', targetAmount: 600000, currentAmount: 450000, deadlineDate: getRelativeDate(50), category: 'otro', color: '#DC2626', icon: 'Award' },
];


/* ========================================================
   INITIAL DATA: SUN (Ingeniería de Software & Cloud)
   ======================================================== */
export const SUN_INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sun-sub-1',
    name: 'Arquitectura de Software & Microservicios',
    code: 'INF-301',
    professor: 'Ing. David Silva',
    classroom: 'Laboratorio de Software 3',
    credits: 4,
    color: '#06B6D4',
    textColor: '#FFFFFF',
    icon: 'Layers',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Lunes', startTime: '08:00', endTime: '11:00', location: 'Lab Software 3' },
      { day: 'Miércoles', startTime: '08:00', endTime: '11:00', location: 'Lab Software 3' },
    ]
  },
  {
    id: 'sun-sub-2',
    name: 'Estructuras de Datos & Algoritmos Complejos',
    code: 'INF-304',
    professor: 'Dr. Marcos Benítez',
    classroom: 'Laboratorio de Algoritmia 1',
    credits: 4,
    color: '#0284C7',
    textColor: '#FFFFFF',
    icon: 'Binary',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Martes', startTime: '09:00', endTime: '12:00', location: 'Lab Algoritmia 1' },
      { day: 'Jueves', startTime: '09:00', endTime: '12:00', location: 'Lab Algoritmia 1' },
    ]
  },
  {
    id: 'sun-sub-3',
    name: 'Desarrollo Web Full-Stack & APIs Cloud',
    code: 'INF-202',
    professor: 'Ing. Sofía Valenzuela',
    classroom: 'Laboratorio Web Avanzado',
    credits: 3,
    color: '#0D9488',
    textColor: '#FFFFFF',
    icon: 'Globe',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Lunes', startTime: '14:00', endTime: '16:00', location: 'Lab Web' },
      { day: 'Viernes', startTime: '10:00', endTime: '12:00', location: 'Lab Web' },
    ]
  },
  {
    id: 'sun-sub-4',
    name: 'Bases de Datos Distribuidas & Cloud',
    code: 'INF-401',
    professor: 'Prof. Lucas Ramírez',
    classroom: 'Cloud Sandbox Room',
    credits: 3,
    color: '#10B981',
    textColor: '#FFFFFF',
    icon: 'Database',
    passingGrade: 3.0,
    scaleMax: 5.0,
    schedule: [
      { day: 'Miércoles', startTime: '14:00', endTime: '16:00', location: 'Cloud Sandbox' },
      { day: 'Viernes', startTime: '14:00', endTime: '16:00', location: 'Cloud Sandbox' },
    ]
  }
];

export const SUN_INITIAL_TASKS: Task[] = [
  {
    id: 'sun-task-1',
    subjectId: 'sun-sub-1',
    title: 'Implementar API Gateway con Microservicios Dockerizados',
    description: 'Configurar enrutamiento, rate limiting y comunicación gRPC con eventos.',
    dueDate: getRelativeDate(1),
    dueTime: '11:00',
    priority: 'alta',
    status: 'en_progreso',
    weightPercentage: 25,
    reminderOption: '1day',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sun-task-2',
    subjectId: 'sun-sub-2',
    title: 'Implementación de Árboles B+ y Algoritmo Dijkstra en C++',
    description: 'Optimización de tiempo de ejecución y análisis asintótico Big-O.',
    dueDate: getRelativeDate(2),
    dueTime: '15:00',
    priority: 'alta',
    status: 'completada',
    weightPercentage: 20,
    reminderOption: '2days',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sun-task-3',
    subjectId: 'sun-sub-3',
    title: 'Deploy Full-Stack React + Node con Pipeline CI/CD',
    description: 'Integrar tests unitarios automatizados y despliegue continuo en AWS.',
    dueDate: getRelativeDate(0),
    dueTime: '18:00',
    priority: 'alta',
    status: 'completada',
    weightPercentage: 25,
    reminderOption: '1h',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sun-task-4',
    subjectId: 'sun-sub-4',
    title: 'Cluster Sharding y Replicación en MongoDB Atlas',
    description: 'Simular alta disponibilidad con particionamiento horizontal de datos.',
    dueDate: getRelativeDate(5),
    dueTime: '14:00',
    priority: 'media',
    status: 'completada',
    weightPercentage: 15,
    reminderOption: '1day',
    createdAt: new Date().toISOString(),
  }
];

export const SUN_INITIAL_GRADES: GradeComponent[] = [
  { id: 'sun-grd-1', subjectId: 'sun-sub-1', name: 'Arquitectura Hexagonal & DDD', percentage: 25, score: 5.0, isCompleted: true },
  { id: 'sun-grd-2', subjectId: 'sun-sub-2', name: 'Evaluación de Grafos y Árboles', percentage: 30, score: 4.8, isCompleted: true },
  { id: 'sun-grd-3', subjectId: 'sun-sub-3', name: 'Proyecto Web Full-Stack en Producción', percentage: 25, score: 4.9, isCompleted: true },
  { id: 'sun-grd-4', subjectId: 'sun-sub-4', name: 'Taller de Bases de Datos NoSQL', percentage: 20, score: 4.7, isCompleted: true },
];

export const SUN_INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'sun-evt-1', title: 'Hackathon Universitario de Software 48 Horas 💻', date: getRelativeDate(0), startTime: '09:00', endTime: '18:00', category: 'academico', color: '#06B6D4', location: 'Hub de Innovación & Tech' },
  { id: 'sun-evt-2', title: 'Meetup de Arquitectura Cloud & Kubernetes ☁️', date: getRelativeDate(3), startTime: '18:00', endTime: '20:30', category: 'social', color: '#0284C7', location: 'Auditorio Tech Torre 4' },
  { id: 'sun-evt-3', title: 'Atardecer en Kayak & Picnic con Amigos 🛶', date: getRelativeDate(4), startTime: '17:00', endTime: '19:30', category: 'salida', color: '#0D9488', location: 'Playa & Muelle Universitario' }
];

export const SUN_INITIAL_EXPENSES: Expense[] = [
  { id: 'sun-exp-1', title: 'Servidor VPS & Créditos Cloud en AWS', amount: 65000, category: 'materiales', date: getRelativeDate(0), paymentMethod: 'transferencia', notes: 'Hosting de proyectos' },
  { id: 'sun-exp-2', title: 'Licencia JetBrains All Products Pack', amount: 55000, category: 'materiales', date: getRelativeDate(1), paymentMethod: 'tarjeta' },
  { id: 'sun-exp-3', title: 'Almuerzo Poke Bowl & Café Frío', amount: 24000, category: 'comida', date: getRelativeDate(0), paymentMethod: 'efectivo' },
];

export const SUN_INITIAL_BUDGET: MonthlyBudget = {
  month: '2026-08',
  totalBudget: 480000,
  categoryLimits: {
    comida: 170000,
    transporte: 90000,
    materiales: 90000,
    salidas: 60000,
    ocio: 30000,
    servicios: 20000,
    ahorro: 20000,
    otros: 0,
  }
};

export const SUN_INITIAL_GOALS: SavingsGoal[] = [
  { id: 'sun-goal-1', title: 'Monitor Curvo Ultrawide 34" para Programar 🖥️', targetAmount: 1600000, currentAmount: 1100000, deadlineDate: getRelativeDate(60), category: 'tecnologia', color: '#06B6D4', icon: 'Monitor' },
  { id: 'sun-goal-2', title: 'Viaje a Conferencia Internacional de Tech en San Francisco ✈️', targetAmount: 2400000, currentAmount: 1450000, deadlineDate: getRelativeDate(100), category: 'viaje', color: '#0284C7', icon: 'Plane' },
  { id: 'sun-goal-3', title: 'Teclado Mecánico Custom Ergonómico ⌨️', targetAmount: 500000, currentAmount: 420000, deadlineDate: getRelativeDate(45), category: 'tecnologia', color: '#0D9488', icon: 'Keyboard' },
];


/* ========================================================
   LOCAL STORAGE UTILS PER USER
   ======================================================== */

export const STORAGE_KEYS = {
  AUTH_CURRENT_USER: 'uniplanner_active_user_v3',
  THEME_DARK: 'uniplanner_dark_mode_v3',
};

export function getUserStorageKey(userId: UserId, dataType: string): string {
  return `uniplanner_${userId}_${dataType}_v3`;
}

export function loadUserData<T>(userId: UserId, dataType: string, defaultValue: T): T {
  try {
    const key = getUserStorageKey(userId, dataType);
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${dataType} for user ${userId}:`, error);
    return defaultValue;
  }
}

export function saveUserData<T>(userId: UserId, dataType: string, value: T): void {
  try {
    const key = getUserStorageKey(userId, dataType);
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${dataType} for user ${userId}:`, error);
  }
}

export function resetUserProgress(userId: UserId): void {
  const dataTypes = ['subjects', 'tasks', 'grades', 'events', 'expenses', 'budget', 'goals', 'notifications', 'sessions'];
  dataTypes.forEach(dataType => {
    const key = getUserStorageKey(userId, dataType);
    localStorage.removeItem(key);
  });
}

export function getInitialUserData(userId: UserId) {
  if (userId === 'anna') {
    return {
      subjects: ANNA_INITIAL_SUBJECTS,
      tasks: ANNA_INITIAL_TASKS,
      grades: ANNA_INITIAL_GRADES,
      events: ANNA_INITIAL_EVENTS,
      expenses: ANNA_INITIAL_EXPENSES,
      budget: ANNA_INITIAL_BUDGET,
      goals: ANNA_INITIAL_GOALS,
    };
  } else if (userId === 'sun') {
    return {
      subjects: SUN_INITIAL_SUBJECTS,
      tasks: SUN_INITIAL_TASKS,
      grades: SUN_INITIAL_GRADES,
      events: SUN_INITIAL_EVENTS,
      expenses: SUN_INITIAL_EXPENSES,
      budget: SUN_INITIAL_BUDGET,
      goals: SUN_INITIAL_GOALS,
    };
  } else {
    return {
      subjects: ISA_INITIAL_SUBJECTS,
      tasks: ISA_INITIAL_TASKS,
      grades: ISA_INITIAL_GRADES,
      events: ISA_INITIAL_EVENTS,
      expenses: ISA_INITIAL_EXPENSES,
      budget: ISA_INITIAL_BUDGET,
      goals: ISA_INITIAL_GOALS,
    };
  }
}

/* ========================================================
   ACHIEVEMENTS & LEADERBOARD STATS ENGINE
   ======================================================== */

export function calculateUserStats(userId: UserId): UserLeaderboardStats {
  const profile = USER_PROFILES[userId];
  const defaults = getInitialUserData(userId);

  const subjects = loadUserData<Subject[]>(userId, 'subjects', defaults.subjects);
  const tasks = loadUserData<Task[]>(userId, 'tasks', defaults.tasks);
  const grades = loadUserData<GradeComponent[]>(userId, 'grades', defaults.grades);
  const goals = loadUserData<SavingsGoal[]>(userId, 'goals', defaults.goals);

  // Compute completed tasks
  const completedTasks = tasks.filter(t => t.status === 'completada').length;
  const totalTasks = tasks.length;

  // Compute overdue tasks
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => t.status !== 'completada' && t.dueDate < today).length;

  // Compute GPA
  const gradedComponents = grades.filter(g => g.isCompleted && typeof g.score === 'number');
  let gpa = 4.5;
  if (gradedComponents.length > 0) {
    const totalScore = gradedComponents.reduce((sum, g) => sum + (g.score || 0), 0);
    gpa = Number((totalScore / gradedComponents.length).toFixed(2));
  }

  // Compute total savings
  const totalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  // Streak simulation or calculation
  const streakDays = Math.max(3, completedTasks + 1);

  // Calculate unlocked achievements
  const stateSnapshot = {
    completedTasks,
    gpa,
    totalSavings,
    streakDays,
    subjectsCount: subjects.length,
    overdueTasks,
  };

  const unlockedAchievements: string[] = [];
  let achievementsXP = 0;

  ACHIEVEMENTS_LIST.forEach(ach => {
    if (ach.condition(stateSnapshot)) {
      unlockedAchievements.push(ach.id);
      achievementsXP += ach.points;
    }
  });

  // Base points:
  // - 40 XP per completed task
  // - 20 XP per enrolled subject
  // - 100 XP if GPA >= 4.0, +100 if GPA >= 4.7
  // - 1 XP per $2,000 saved (capped at 250 XP)
  // - 20 XP per streak day
  let baseXP = 
    (completedTasks * 40) +
    (subjects.length * 20) +
    (gpa >= 4.7 ? 200 : gpa >= 4.0 ? 120 : 50) +
    Math.min(250, Math.round(totalSavings / 2000)) +
    (streakDays * 20);

  const totalXP = baseXP + achievementsXP;
  const levelInfo = getLevelFromXP(totalXP);

  return {
    userId,
    userName: profile.name,
    career: profile.career,
    avatarEmoji: profile.avatarEmoji,
    theme: profile.theme,
    totalXP,
    level: levelInfo.level,
    levelTitle: levelInfo.title,
    completedTasks,
    totalTasks,
    gpa,
    totalSavings,
    subjectsCount: subjects.length,
    unlockedAchievements,
    streakDays,
  };
}

export function getAllUsersLeaderboard(): UserLeaderboardStats[] {
  const users: UserId[] = ['anna', 'isa', 'sun'];
  const statsList = users.map(u => calculateUserStats(u));

  // Sort descending by totalXP
  statsList.sort((a, b) => b.totalXP - a.totalXP);

  // Assign ranks
  return statsList.map((stat, index) => ({
    ...stat,
    rank: index + 1,
  }));
}
