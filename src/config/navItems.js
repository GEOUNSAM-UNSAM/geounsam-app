import { House, Search, MapPin, Calendar, User } from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Inicio', shortLabel: 'Inicio', path: '/inicio', icon: House },
  { label: 'Buscar', shortLabel: 'Buscar', path: '/buscar', icon: Search },
  { label: 'Mapa', shortLabel: 'Mapa', path: '/mapa', icon: MapPin },
  {
    label: 'Mi Cursada',
    shortLabel: 'Cursada',
    path: '/cursada',
    icon: Calendar,
  },
];

export const NAV_ITEMS_MOBILE = [
  ...NAV_ITEMS,
  { label: 'Perfil', shortLabel: 'Perfil', path: '/perfil', icon: User },
];
