import type { IGuide } from '../entities/Guide';

export interface GuideRepository {
  getById(guideId: string): IGuide | null;
}
