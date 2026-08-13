import { Vacation } from '../../domain/entities/Vacation.js';
import { VacationRepository } from '../../domain/repositories/VacationRepository.js';
import vacationData from '../data/vacation.json';

export class JsonVacationRepository extends VacationRepository {
  get() {
    return new Vacation(vacationData);
  }
}
