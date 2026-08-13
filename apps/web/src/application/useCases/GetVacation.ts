import type { IVacation } from '../../domain/entities/Vacation';
import type { VacationRepository } from '../../domain/repositories/VacationRepository';

export class GetVacation {
  constructor(private readonly vacationRepository: VacationRepository) {}

  execute(): IVacation {
    return this.vacationRepository.get();
  }
}
