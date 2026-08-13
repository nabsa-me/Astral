export class GetVacation {
  constructor(vacationRepository) {
    this.vacationRepository = vacationRepository;
  }

  execute() {
    return this.vacationRepository.get();
  }
}
