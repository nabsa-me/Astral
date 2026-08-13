import { useNavigate } from 'react-router';
import { PageShell } from '../../shared/components/pageShell/PageShell';
import { EmptyState } from '../../shared/components/emptyState/EmptyState';
import { RouteCard } from '../../shared/components/card/RouteCard';
import { useServices } from '../../app/servicesContext';
import { tripPath } from '../../app/appRoutes';

const ExplorePage = () => {
  const navigate = useNavigate();
  const { getFeed, getCurrentUser } = useServices();
  const routes = getFeed();
  const currentUser = getCurrentUser();

  return (
    <PageShell title="Explorar" subtitle="Descubre rutas y diarios de toda la comunidad.">
      {routes.length > 0 ? (
        <div className="card-grid">
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              owner={currentUser && currentUser.id === route.ownerId ? currentUser : null}
              onOpen={() => navigate(tripPath(route.vacationId ?? route.id))}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="map"
          title="Aún no hay nada que explorar"
          subtitle="Cuando la comunidad comparta rutas públicas, aparecerán aquí para que las descubras."
        />
      )}
    </PageShell>
  );
};

export default ExplorePage;
