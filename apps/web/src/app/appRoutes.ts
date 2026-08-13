import type { IAppRoutesMap } from './appTypes';

export const APP_ROUTES: IAppRoutesMap = {
  home: '/',
  explore: '/explore',
  myRoutes: '/my-routes',
  diaries: '/diaries',
  profile: '/profile',
  trip: '/trips/:tripId',
  diary: '/diaries/:diaryId',
} as const;

/** Builds a concrete trip (route/planner) URL from a trip id. */
export const tripPath = (tripId: string): string => `/trips/${tripId}`;

/** Builds a concrete diary (travel story) URL from a diary id. */
export const diaryPath = (diaryId: string): string => `/diaries/${diaryId}`;
