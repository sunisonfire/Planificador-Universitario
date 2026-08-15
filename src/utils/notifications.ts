import { Task, Subject, AppNotification } from '../types';
import { sound } from './audio';

export class NotificationManager {
  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  static getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  static sendPushNotification(title: string, options?: NotificationOptions) {
    sound.playAlert();
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      } catch (err) {
        console.warn('Native notification failed, using in-app alert', err);
      }
    }
  }

  // Calculate days remaining until due date
  static getDaysRemaining(dueDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dueDate.split('-').map(Number);
    const target = new Date(year, month - 1, day);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if a task is due in less than 3 days (e.g. today=0, tomorrow=1, 2 days=2, 3 days or overdue)
  static isDueSoon(dueDate: string): { isDue: boolean; daysLeft: number; label: string; isOverdue: boolean } {
    const daysLeft = this.getDaysRemaining(dueDate);
    const isOverdue = daysLeft < 0;
    const isDue = daysLeft >= 0 && daysLeft <= 3;

    let label = '';
    if (isOverdue) {
      label = `¡Venció hace ${Math.abs(daysLeft)} día${Math.abs(daysLeft) === 1 ? '' : 's'}!`;
    } else if (daysLeft === 0) {
      label = '¡Vence HOY!';
    } else if (daysLeft === 1) {
      label = '¡Vence MAÑANA!';
    } else if (daysLeft === 2) {
      label = 'Vence en 2 días';
    } else if (daysLeft === 3) {
      label = 'Vence en 3 días';
    } else {
      label = `En ${daysLeft} días`;
    }

    return {
      isDue: isDue || isOverdue,
      daysLeft,
      label,
      isOverdue
    };
  }

  // Scan tasks and build active notifications
  static checkUpcomingTasks(tasks: Task[], subjects: Subject[]): AppNotification[] {
    const subjectMap = new Map(subjects.map(s => [s.id, s.name]));
    const alerts: AppNotification[] = [];

    tasks.forEach(task => {
      if (task.status === 'completada') return;

      const urgency = this.isDueSoon(task.dueDate);
      if (urgency.isDue) {
        const subjectName = subjectMap.get(task.subjectId) || 'Materia';
        alerts.push({
          id: `alert-${task.id}`,
          title: urgency.isOverdue 
            ? `⚠️ Tarea Vencida: ${task.title}` 
            : `⏰ Recordatorio de Entrega (${urgency.label})`,
          message: `${task.title} para ${subjectName}. Hora límite: ${task.dueTime || '23:59'}.`,
          timestamp: new Date().toISOString(),
          type: 'urgent_task',
          read: false,
          taskId: task.id,
        });
      }
    });

    return alerts;
  }
}
