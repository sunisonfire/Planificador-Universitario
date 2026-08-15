import React from 'react';
import { 
  AppNotification, 
  Task, 
  Subject 
} from '../types';
import { 
  Bell, 
  Check, 
  Clock, 
  Trash2, 
  Sparkles, 
  Volume2, 
  ShieldCheck, 
  AlertTriangle,
  Send
} from 'lucide-react';
import { NotificationManager } from '../utils/notifications';
import { sound } from '../utils/audio';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onRequestPushPermission: () => void;
  pushPermission: NotificationPermission;
  tasks: Task[];
  subjects: Subject[];
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onRequestPushPermission,
  pushPermission,
  tasks,
  subjects,
}) => {
  if (!isOpen) return null;

  const testPushNotification = () => {
    sound.playAlert();
    NotificationManager.sendPushNotification('✨ ¡Hola Isa! Notificación Activada', {
      body: 'Tus alertas de entregas universitarias y salidas están funcionando a la perfección 🌸',
      tag: 'test-notif',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Centro de Notificaciones & Alertas
              </h3>
              <p className="text-xs text-slate-300">
                Recordatorios de entrega y avisos automáticos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Push Notification Permission Box */}
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/15 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">
                Notificaciones Push del Navegador
              </span>
            </div>

            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              pushPermission === 'granted'
                ? 'bg-emerald-500 text-white shadow-sm'
                : pushPermission === 'denied'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-amber-500 text-white shadow-sm'
            }`}>
              {pushPermission === 'granted' ? 'Activadas ✅' : pushPermission === 'denied' ? 'Bloqueadas ❌' : 'Pendiente ⏳'}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Recibe recordatorios en tu celular o computador cuando una tarea esté a punto de vencer (&lt; 3 días).
          </p>

          <div className="flex items-center gap-2 pt-1">
            {pushPermission !== 'granted' ? (
              <button
                onClick={onRequestPushPermission}
                className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                Solicitar Permiso Push
              </button>
            ) : (
              <button
                onClick={testPushNotification}
                className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Notificación de Prueba</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[180px]">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 flex items-start gap-3 transition-all"
              >
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white">
                    {notif.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <Sparkles className="w-8 h-8 text-purple-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-white">
                No tienes notificaciones pendientes
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Te avisaremos cuando tengas tareas por entregar en menos de 3 días.
              </p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        {notifications.length > 0 && (
          <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs">
            <button
              onClick={onMarkAllAsRead}
              className="text-purple-300 font-bold hover:underline"
            >
              Marcar leídas
            </button>
            <button
              onClick={onClearNotifications}
              className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar todo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
