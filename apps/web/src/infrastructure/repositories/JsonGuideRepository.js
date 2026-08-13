import { Guide } from '../../domain/entities/Guide.js';
import { GuideRepository } from '../../domain/repositories/GuideRepository.js';
import mezquitaCordoba from '../data/guides/mezquita-cordoba.json';
import puenteRomano from '../data/guides/puente-romano.json';
import puenteSanRafael from '../data/guides/puente-san-rafael.json';
import tardeCordoba from '../data/guides/tarde-cordoba.json';

const guides = {
  'mezquita-cordoba': mezquitaCordoba,
  'puente-romano': puenteRomano,
  'puente-san-rafael': puenteSanRafael,
  'tarde-cordoba': tardeCordoba,
};

export class JsonGuideRepository extends GuideRepository {
  getById(guideId) {
    const data = guides[guideId];
    if (!data) return null;
    return new Guide(data);
  }
}
