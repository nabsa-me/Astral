import { useParams } from 'react-router';
import VacationView from '../../features/vacation/VacationView';
import { useServices } from '../../app/servicesContext';

const TripPage = () => {
  const { tripId } = useParams();
  const {
    getVacation,
    getCityBundle,
    getSharedRouteById,
    getUserById,
    getCurrentUser,
    getDiariesByRoute,
  } = useServices();

  const vacation = getVacation(tripId);
  const cordoba = getCityBundle('cordoba');
  const sharedRoute = tripId ? getSharedRouteById(tripId) : null;
  const owner = sharedRoute ? getUserById(sharedRoute.ownerId) : getCurrentUser();
  const diaries = sharedRoute ? getDiariesByRoute(sharedRoute.id) : [];

  return (
    <div className="trip-page">
      <VacationView
        vacation={vacation}
        cordoba={cordoba}
        sharedRoute={sharedRoute}
        owner={owner}
        diaries={diaries}
      />
    </div>
  );
};

export default TripPage;
