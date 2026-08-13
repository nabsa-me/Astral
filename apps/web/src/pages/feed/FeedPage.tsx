import { useNavigate } from 'react-router';
import { PageShell } from '../../shared/components/pageShell/PageShell';
import { EmptyState } from '../../shared/components/emptyState/EmptyState';
import { RouteCard } from '../../shared/components/card/RouteCard';
import { useServices } from '../../app/servicesContext';
import { tripPath } from '../../app/appRoutes';

const FeedPage = () => {
  const navigate = useNavigate();
  const { getFeed, getCurrentUser } = useServices();
  const feed = getFeed();
  const currentUser = getCurrentUser();
  const ownerFor = (ownerId: string) =>
    currentUser && currentUser.id === ownerId ? currentUser : null;

  return (
    <PageShell title="Feed" subtitle="Las últimas rutas y diarios de la gente que sigues.">
      {feed.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          owner={ownerFor(route.ownerId)}
          onOpen={() => navigate(tripPath(route.vacationId ?? route.id))}
        />
      ))}
      <EmptyState
        icon="explore"
        title="Sigue a más viajeros"
        subtitle="Cuando sigas a otras personas, sus nuevas rutas y diarios aparecerán aquí."
      />
    </PageShell>
  );
};

export default FeedPage;
