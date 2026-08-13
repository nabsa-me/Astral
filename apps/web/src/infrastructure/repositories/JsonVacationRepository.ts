import { Vacation, type IVacation } from '../../domain/entities/Vacation';
import type { VacationRepository } from '../../domain/repositories/VacationRepository';
import vacationData from '../data/vacation.json';

export class JsonVacationRepository implements VacationRepository {
  get(): IVacation {
    return new Vacation(vacationData as unknown as IVacation);
  }
}
