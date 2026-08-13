import type { IVacation } from '../entities/Vacation';

export interface VacationRepository {
  get(): IVacation;
}
