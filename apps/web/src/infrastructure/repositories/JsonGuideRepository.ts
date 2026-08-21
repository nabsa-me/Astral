import { Guide, type IGuide } from '../../domain/entities/Guide';
import type { GuideRepository } from '../../domain/repositories/GuideRepository';
import ahillones from '../data/guides/ahillones.json';
import almodovarDelRio from '../data/guides/almodovar-del-rio.json';
import aracenaAhillones from '../data/guides/aracena-ahillones.json';
import domingoTardeCordoba from '../data/guides/domingo-tarde-cordoba.json';
import fuentePalmera from '../data/guides/fuente-palmera.json';
import mezquitaCordoba from '../data/guides/mezquita-cordoba.json';
import ochavilloDelRio from '../data/guides/ochavillo-del-rio.json';
import puenteRomano from '../data/guides/puente-romano.json';
import puenteSanRafael from '../data/guides/puente-san-rafael.json';
import tardeCordoba from '../data/guides/tarde-cordoba.json';
import zafra from '../data/guides/zafra.json';

const guides: Record<string, IGuide> = {
  'ahillones': ahillones as unknown as IGuide,
  'almodovar-del-rio': almodovarDelRio as unknown as IGuide,
  'aracena-ahillones': aracenaAhillones as unknown as IGuide,
  'domingo-tarde-cordoba': domingoTardeCordoba as unknown as IGuide,
  'fuente-palmera': fuentePalmera as unknown as IGuide,
  'mezquita-cordoba': mezquitaCordoba as unknown as IGuide,
  'ochavillo-del-rio': ochavilloDelRio as unknown as IGuide,
  'puente-romano': puenteRomano as unknown as IGuide,
  'puente-san-rafael': puenteSanRafael as unknown as IGuide,
  'tarde-cordoba': tardeCordoba as unknown as IGuide,
  'zafra': zafra as unknown as IGuide,
};

export class JsonGuideRepository implements GuideRepository {
  getById(guideId: string): IGuide | null {
    const data = guides[guideId];
    if (!data) return null;
    return new Guide(data);
  }
}
