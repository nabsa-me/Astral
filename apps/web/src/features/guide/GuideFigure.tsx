import type { IGuideFigure } from '../../domain/entities/Guide';

interface GuideFigureProps {
  figure: IGuideFigure;
}

export default function GuideFigure({ figure }: GuideFigureProps) {
  return (
    <figure className="guide-figure">
      {figure.type === 'svg' ? (
        <div className="guide-figure-svg" dangerouslySetInnerHTML={{ __html: figure.svg }} />
      ) : (
        <img src={figure.src} alt={figure.alt || figure.caption || ''} loading="lazy" />
      )}
      <figcaption>
        {figure.fignum && <span className="guide-figure-num">{figure.fignum}. </span>}
        {figure.caption}
        {figure.credit && <span className="guide-figure-credit"> — {figure.credit}</span>}
      </figcaption>
    </figure>
  );
}
