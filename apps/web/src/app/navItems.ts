import { APP_ROUTES } from './appRoutes';
import type { INavItem } from './appTypes';

export const NAV_ITEMS: INavItem[] = [
  { label: 'Feed', icon: 'home', path: APP_ROUTES.home },
  { label: 'Explorar', icon: 'explore', path: APP_ROUTES.explore },
  { label: 'Mis rutas', icon: 'map', path: APP_ROUTES.myRoutes },
  { label: 'Diarios', icon: 'menu_book', path: APP_ROUTES.diaries },
  { label: 'Perfil', icon: 'person', path: APP_ROUTES.profile },
];
