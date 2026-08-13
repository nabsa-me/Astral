import { GetPointsByCity } from '../application/useCases/GetPointsByCity';
import { GetGuideById } from '../application/useCases/GetGuideById';
import { GetRoutesByCity } from '../application/useCases/GetRoutesByCity';
import { GetVacation } from '../application/useCases/GetVacation';
import { GetCurrentUser } from '../application/useCases/GetCurrentUser';
import { GetUserById } from '../application/useCases/GetUserById';
import { GetFeed } from '../application/useCases/GetFeed';
import { GetRoutesByUser } from '../application/useCases/GetRoutesByUser';
import { GetDiariesByUser } from '../application/useCases/GetDiariesByUser';
import { GetSharedRouteById } from '../application/useCases/GetSharedRouteById';
import { JsonPointRepository } from '../infrastructure/repositories/JsonPointRepository';
import { JsonGuideRepository } from '../infrastructure/repositories/JsonGuideRepository';
import { JsonRouteRepository } from '../infrastructure/repositories/JsonRouteRepository';
import { JsonVacationRepository } from '../infrastructure/repositories/JsonVacationRepository';
import { JsonUserRepository } from '../infrastructure/repositories/social/JsonUserRepository';
import { JsonSharedRouteRepository } from '../infrastructure/repositories/social/JsonSharedRouteRepository';
import { JsonTravelDiaryRepository } from '../infrastructure/repositories/social/JsonTravelDiaryRepository';
import type { ICity } from '../domain/entities/City';
import type { IGuide } from '../domain/entities/Guide';
import type { IPointOfInterest } from '../domain/entities/PointOfInterest';
import type { IRoute } from '../domain/entities/Route';
import type { IVacation } from '../domain/entities/Vacation';
import type { IUser } from '../domain/entities/social/User';
import type { ISharedRoute } from '../domain/entities/social/SharedRoute';
import type { ITravelDiary } from '../domain/entities/social/TravelDiary';

/** Everything the map/guide viewer needs for a city, resolved once. */
export interface CityBundle {
  city: ICity | null;
  points: IPointOfInterest[];
  routes: IRoute[];
  getGuideForPoint: (item: { guideId?: string } | null | undefined) => IGuide | null;
}

/** Application service surface consumed by the presentation layer. */
export interface AppServices {
  // Trip / map / guide viewer
  getVacation: (tripId?: string) => IVacation;
  getCityBundle: (cityId: string) => CityBundle;
  // Social (read-only this iteration)
  getCurrentUser: () => IUser | null;
  getUserById: (id: string) => IUser | null;
  getFeed: () => ISharedRoute[];
  getSharedRoutesByOwner: (ownerId: string) => ISharedRoute[];
  getSharedRouteById: (id: string) => ISharedRoute | null;
  getDiariesByOwner: (ownerId: string) => ITravelDiary[];
}

/**
 * Composition root: wires JSON repositories to use cases and exposes a small
 * service surface. Kept UI-agnostic; the React layer receives it via context.
 */
export const createServices = (): AppServices => {
  const pointRepository = new JsonPointRepository();
  const guideRepository = new JsonGuideRepository();
  const routeRepository = new JsonRouteRepository();
  const vacationRepository = new JsonVacationRepository();
  const userRepository = new JsonUserRepository();
  const sharedRouteRepository = new JsonSharedRouteRepository();
  const travelDiaryRepository = new JsonTravelDiaryRepository();

  const getPointsByCity = new GetPointsByCity(pointRepository);
  const getGuideById = new GetGuideById(guideRepository);
  const getRoutesByCity = new GetRoutesByCity(routeRepository);
  const getVacation = new GetVacation(vacationRepository);
  const getCurrentUser = new GetCurrentUser(userRepository);
  const getUserById = new GetUserById(userRepository);
  const getFeed = new GetFeed(sharedRouteRepository);
  const getRoutesByUser = new GetRoutesByUser(sharedRouteRepository);
  const getDiariesByUser = new GetDiariesByUser(travelDiaryRepository);
  const getSharedRouteById = new GetSharedRouteById(sharedRouteRepository);

  return {
    // Single seed vacation for now; tripId is accepted for future multi-trip support.
    getVacation: () => getVacation.execute(),
    getCityBundle: (cityId) => ({
      city: pointRepository.getCity(cityId),
      points: getPointsByCity.execute(cityId),
      routes: getRoutesByCity.execute(cityId),
      getGuideForPoint: (item) => (item?.guideId ? getGuideById.execute(item.guideId) : null),
    }),
    getCurrentUser: () => getCurrentUser.execute(),
    getUserById: (id) => getUserById.execute(id),
    getFeed: () => getFeed.execute(),
    getSharedRoutesByOwner: (ownerId) => getRoutesByUser.execute(ownerId),
    getSharedRouteById: (id) => getSharedRouteById.execute(id),
    getDiariesByOwner: (ownerId) => getDiariesByUser.execute(ownerId),
  };
};
