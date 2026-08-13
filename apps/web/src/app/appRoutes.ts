import type { IAppRoutesMap } from './appTypes';

export const APP_ROUTES: IAppRoutesMap = {
  home: '/',
  explore: '/explore',
  myRoutes: '/my-routes',
  diaries: '/diaries',
  profile: '/profile',
  trip: '/trips/:tripId',
} as const;

/** Builds a concrete trip URL from a trip id. */
export const tripPath = (tripId: string): string => `/trips/${tripId}`;
