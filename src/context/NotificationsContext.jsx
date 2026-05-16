import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import {
  getNotificacionesReportesFavoritos,
  subscribeReportesFavoritos,
} from '../services/notificaciones';
import ActionToast from '../components/ActionToast';

const NotificationsContext = createContext();

function getDismissedStorageKey(userId) {
  return `geounsam:notificaciones:descartadas:${userId}`;
}

function readDismissedIds(userId) {
  if (!userId) return [];

  try {
    return JSON.parse(
      localStorage.getItem(getDismissedStorageKey(userId)) ?? '[]'
    );
  } catch {
    return [];
  }
}

function saveDismissedIds(userId, ids) {
  if (!userId) return;
  localStorage.setItem(getDismissedStorageKey(userId), JSON.stringify(ids));
}

function buildToastFromNotification(notificacion) {
  if (!notificacion) return null;

  if (notificacion.tipo === 'confirmado') {
    return {
      variant: 'notification',
      title: 'Llegó una notificación',
      description: notificacion.descripcion,
    };
  }

  const cambio = notificacion.detalle
    ? `${notificacion.detalle.anterior} -> ${notificacion.detalle.nuevo}`
    : 'Nuevo cambio reportado';

  return {
    variant: 'notification',
    title: 'Llegó una notificación',
    description: `${notificacion.titulo}: ${cambio}`,
  };
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      'useNotifications debe usarse dentro de NotificationsProvider'
    );
  }
  return context;
}

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setDismissedIds(readDismissedIds(user?.id));
  }, [user?.id]);

  useEffect(() => {
    let ignore = false;
    let channel = null;

    async function cargarNotificaciones({ silent = false, payload = null } = {}) {
      if (!user?.id) {
        setNotificaciones([]);
        setLoading(false);
        return { comisionIds: [] };
      }

      if (!silent) setLoading(true);
      setError(null);

      try {
        const resultado = await getNotificacionesReportesFavoritos(user.id);
        if (ignore) return resultado;

        setNotificaciones(resultado.notificaciones);
        if (payload?.new?.id && payload.table) {
          const nuevaNotificacion = resultado.notificaciones.find(
            (notificacion) =>
              notificacion.sourceTable === payload.table &&
              notificacion.sourceId === payload.new.id
          );

          if (nuevaNotificacion) {
            setToast(buildToastFromNotification(nuevaNotificacion));
          }
        }
        return resultado;
      } catch (nextError) {
        console.error(nextError);
        if (!ignore) {
          setError('No pudimos cargar tus notificaciones');
          setNotificaciones([]);
        }
        return { comisionIds: [] };
      } finally {
        if (!ignore && !silent) setLoading(false);
      }
    }

    cargarNotificaciones().then((resultado) => {
      if (ignore || !resultado?.comisionIds?.length) return;

      channel = subscribeReportesFavoritos({
        userId: user.id,
        comisionIds: resultado.comisionIds,
        onChange: (payload) =>
          cargarNotificaciones({ silent: true, payload }),
      });
    });

    return () => {
      ignore = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const notificacionesVisibles = notificaciones.filter(
    (notificacion) => !dismissedIds.includes(notificacion.id)
  );
  const hayNotificaciones = notificacionesVisibles.length > 0;

  const limpiarTodo = () => {
    const nextDismissedIds = Array.from(
      new Set([...dismissedIds, ...notificaciones.map((item) => item.id)])
    );
    setDismissedIds(nextDismissedIds);
    saveDismissedIds(user?.id, nextDismissedIds);
  };

  return (
    <NotificationsContext.Provider
      value={{
        loading,
        error,
        notificaciones: notificacionesVisibles,
        hayNotificaciones,
        limpiarTodo,
      }}
    >
      {children}
      <ActionToast toast={toast} onClose={() => setToast(null)} />
    </NotificationsContext.Provider>
  );
}
