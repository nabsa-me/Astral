export type AppRoutePath =
  | '/'
  | '/explore'
  | '/my-routes'
  | '/diaries'
  | '/profile'
  | '/trips/:tripId'
  | '/diaries/:diaryId';

export interface IAppRoutesMap {
  home: AppRoutePath;
  explore: AppRoutePath;
  myRoutes: AppRoutePath;
  diaries: AppRoutePath;
  profile: AppRoutePath;
  trip: AppRoutePath;
  diary: AppRoutePath;
}

export interface INavItem {
  label: string;
  icon: string;
  path: AppRoutePath;
}
