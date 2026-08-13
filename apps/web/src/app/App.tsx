import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import useTheme from '../shared/hooks/useTheme';
import DesktopLayout from '../layouts/Desktop/DesktopLayout';
import FeedPage from '../pages/feed/FeedPage';
import ExplorePage from '../pages/explore/ExplorePage';
import MyRoutesPage from '../pages/myRoutes/MyRoutesPage';
import DiariesPage from '../pages/diaries/DiariesPage';
import ProfilePage from '../pages/profile/ProfilePage';
import TripPage from '../pages/trip/TripPage';
import { APP_ROUTES } from './appRoutes';

const AppInner = () => {
  // Applies the light theme class to <html> on mount.
  useTheme();

  return (
    <Routes>
      <Route path={APP_ROUTES.home} element={<DesktopLayout />}>
        <Route index element={<FeedPage />} />
        <Route path={APP_ROUTES.explore} element={<ExplorePage />} />
        <Route path={APP_ROUTES.myRoutes} element={<MyRoutesPage />} />
        <Route path={APP_ROUTES.diaries} element={<DiariesPage />} />
        <Route path={APP_ROUTES.profile} element={<ProfilePage />} />
        <Route path={APP_ROUTES.trip} element={<TripPage />} />
      </Route>
      <Route path="*" element={<Navigate to={APP_ROUTES.home} replace />} />
    </Routes>
  );
};

const App = () => (
  <div className="appRoot">
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  </div>
);

export default App;
