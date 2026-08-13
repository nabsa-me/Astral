import VacationView from './presentation/components/vacation/VacationView.jsx';
import { GetPointsByCity } from './application/useCases/GetPointsByCity.js';
import { GetGuideById } from './application/useCases/GetGuideById.js';
import { GetRoutesByCity } from './application/useCases/GetRoutesByCity.js';
import { GetVacation } from './application/useCases/GetVacation.js';
import { JsonPointRepository } from './infrastructure/repositories/JsonPointRepository.js';
import { JsonGuideRepository } from './infrastructure/repositories/JsonGuideRepository.js';
import { JsonRouteRepository } from './infrastructure/repositories/JsonRouteRepository.js';
import { JsonVacationRepository } from './infrastructure/repositories/JsonVacationRepository.js';

const pointRepository = new JsonPointRepository();
const guideRepository = new JsonGuideRepository();
const routeRepository = new JsonRouteRepository();
const vacationRepository = new JsonVacationRepository();
const getPointsByCity = new GetPointsByCity(pointRepository);
const getGuideById = new GetGuideById(guideRepository);
const getRoutesByCity = new GetRoutesByCity(routeRepository);
const getVacation = new GetVacation(vacationRepository);

export default function App() {
  const vacation = getVacation.execute();
  const cordoba = {
    city: pointRepository.getCity('cordoba'),
    points: getPointsByCity.execute('cordoba'),
    routes: getRoutesByCity.execute('cordoba'),
    getGuideForPoint: (item) => (item?.guideId ? getGuideById.execute(item.guideId) : null),
  };

  return <VacationView vacation={vacation} cordoba={cordoba} />;
}
