import type { IGuide } from '../../domain/entities/Guide';
import type { GuideRepository } from '../../domain/repositories/GuideRepository';

export class GetGuideById {
  constructor(private readonly guideRepository: GuideRepository) {}

  execute(guideId: string): IGuide | null {
    return this.guideRepository.getById(guideId);
  }
}
