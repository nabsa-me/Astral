import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageShell } from '../../shared/components/pageShell/PageShell';
import { EmptyState } from '../../shared/components/emptyState/EmptyState';
import { RouteCard } from '../../shared/components/card/RouteCard';
import { DiaryCard } from '../../shared/components/card/DiaryCard';
import { TabsNavigation } from '../../shared/components/navigationCards/TabsNavigation';
import { useServices } from '../../app/servicesContext';
import { tripPath } from '../../app/appRoutes';
import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';

const TABS = ['Rutas', 'Diarios'];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { getCurrentUser, getSharedRoutesByOwner, getDiariesByOwner, getSharedRouteById } =
    useServices();
  const [activeTab, setActiveTab] = useState('Rutas');

  const user = getCurrentUser();
  const routes = user ? getSharedRoutesByOwner(user.id) : [];
  const diaries = user ? getDiariesByOwner(user.id) : [];
  const initial = user?.displayName?.trim().charAt(0).toUpperCase() ?? 'N';
  const stats = user?.stats;

  const openDiary = (diary: ITravelDiary) => {
    if (!diary.sharedRouteId) return;
    const shared = getSharedRouteById(diary.sharedRouteId);
    if (shared?.vacationId) navigate(tripPath(shared.vacationId));
  };

  return (
    <PageShell title="Perfil">
      <div className="profile-header">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-meta">
          <h2 className="profile-name">{user?.displayName ?? 'Tu perfil'}</h2>
          {user?.handle ? <p className="profile-handle">@{user.handle}</p> : null}
          {user?.bio ? <p className="profile-bio">{user.bio}</p> : null}
          {stats ? (
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{stats.routes}</span>
                <span className="profile-stat-label">Rutas</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{stats.diaries}</span>
                <span className="profile-stat-label">Diarios</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{stats.followers}</span>
                <span className="profile-stat-label">Seguidores</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <TabsNavigation tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'Rutas' ? (
        routes.length > 0 ? (
          <div className="card-grid">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                owner={user}
                onOpen={() => navigate(tripPath(route.vacationId ?? route.id))}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="route"
            title="Sin rutas todavía"
            subtitle="Las rutas que compartas aparecerán en tu perfil."
          />
        )
      ) : diaries.length > 0 ? (
        diaries.map((diary) => (
          <DiaryCard
            key={diary.id}
            diary={diary}
            onOpen={diary.sharedRouteId ? () => openDiary(diary) : undefined}
          />
        ))
      ) : (
        <EmptyState
          icon="menu_book"
          title="Sin diarios todavía"
          subtitle="Los diarios que escribas aparecerán en tu perfil."
        />
      )}
    </PageShell>
  );
};

export default ProfilePage;
