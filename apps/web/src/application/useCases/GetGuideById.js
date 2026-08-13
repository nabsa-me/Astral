export class GetGuideById {
  constructor(guideRepository) {
    this.guideRepository = guideRepository;
  }

  execute(guideId) {
    return this.guideRepository.getById(guideId);
  }
}
