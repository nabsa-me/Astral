export interface IGuideFigureBase {
  fignum?: string;
  caption?: string;
  credit?: string;
}

export interface IGuideSvgFigure extends IGuideFigureBase {
  type: 'svg';
  svg: string;
}

export interface IGuideImageFigure extends IGuideFigureBase {
  type: 'image';
  src: string;
  alt?: string;
}

export type IGuideFigure = IGuideSvgFigure | IGuideImageFigure;

export interface IGuideSection {
  id: string;
  level: 2 | 3;
  title: string;
  paragraphs?: string[];
  figures?: IGuideFigure[];
  subsections?: IGuideSection[];
}

export interface IGuide {
  id: string;
  title: string;
  subtitle?: string;
  sections: IGuideSection[];
}

export class Guide implements IGuide {
  id: string;
  title: string;
  subtitle?: string;
  sections: IGuideSection[];

  constructor({ id, title, subtitle, sections }: IGuide) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.sections = sections;
  }
}
