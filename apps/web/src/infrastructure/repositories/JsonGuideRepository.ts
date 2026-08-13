import { Guide, type IGuide } from '../../domain/entities/Guide';
import type { GuideRepository } from '../../domain/repositories/GuideRepository';
import mezquitaCordoba from '../data/guides/mezquita-cordoba.json';
import puenteRomano from '../data/guides/puente-romano.json';
import puenteSanRafael from '../data/guides/puente-san-rafael.json';
import tardeCordoba from '../data/guides/tarde-cordoba.json';

const guides: Record<string, IGuide> = {
  'mezquita-cordoba': mezquitaCordoba as unknown as IGuide,
  'puente-romano': puenteRomano as unknown as IGuide,
  'puente-san-rafael': puenteSanRafael as unknown as IGuide,
  'tarde-cordoba': tardeCordoba as unknown as IGuide,
};

export class JsonGuideRepository implements GuideRepository {
  getById(guideId: string): IGuide | null {
    const data = guides[guideId];
    if (!data) return null;
    return new Guide(data);
  }
}
