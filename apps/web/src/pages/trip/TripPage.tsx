import { useParams } from 'react-router';
import VacationView from '../../features/vacation/VacationView';
import { useServices } from '../../app/servicesContext';

const TripPage = () => {
  const { tripId } = useParams();
  const { getVacation, getCityBundle, getSharedRouteById, getUserById, getCurrentUser } =
    useServices();

  const vacation = getVacation(tripId);
  const cordoba = getCityBundle('cordoba');
  const sharedRoute = tripId ? getSharedRouteById(tripId) : null;
  const owner = sharedRoute ? getUserById(sharedRoute.ownerId) : getCurrentUser();

  return (
    <div className="trip-page">
      <VacationView
        vacation={vacation}
        cordoba={cordoba}
        sharedRoute={sharedRoute}
        owner={owner}
      />
    </div>
  );
};

export default TripPage;
