import { useNavigate } from 'react-router';
import { PageShell } from '../../shared/components/pageShell/PageShell';
import { EmptyState } from '../../shared/components/emptyState/EmptyState';
import { RouteCard } from '../../shared/components/card/RouteCard';
import { Button } from '../../shared/components/buttons/buttons';
import { useServices } from '../../app/servicesContext';
import { tripPath } from '../../app/appRoutes';

const MyRoutesPage = () => {
  const navigate = useNavigate();
  const { getCurrentUser, getSharedRoutesByOwner } = useServices();
  const currentUser = getCurrentUser();
  const routes = currentUser ? getSharedRoutesByOwner(currentUser.id) : [];

  return (
    <PageShell
      title="Mis rutas"
      subtitle="Las rutas que has creado y compartido."
      actions={<Button label="Nueva ruta" disabled />}
    >
      {routes.length > 0 ? (
        <div className="card-grid">
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              owner={currentUser}
              onOpen={() => navigate(tripPath(route.vacationId ?? route.id))}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="route"
          title="Todavía no has creado rutas"
          subtitle="Crea tu primera ruta para empezar a construir tu perfil de viajes."
          action={<Button label="Crear ruta" variant="secondary" disabled />}
        />
      )}
    </PageShell>
  );
};

export default MyRoutesPage;
