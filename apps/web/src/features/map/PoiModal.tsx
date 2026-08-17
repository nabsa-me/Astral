import { useEffect } from 'react';
import { Icon } from '../../shared/components/icons/icons';
import GuideView from '../guide/GuideView';
import type { IGuide } from '../../domain/entities/Guide';

interface PoiModalProps {
  /** Only the name is rendered in the fallback; any named entity works. */
  point: { name: string };
  guide: IGuide | null;
  initialSectionId: string | null;
  onClose: () => void;
  /** When present, renders a "Ver en mapa" CTA next to the close button. */
  onLocateOnMap?: () => void;
}

export default function PoiModal({
  point,
  guide,
  initialSectionId,
  onClose,
  onLocateOnMap,
}: PoiModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()}>
        {onLocateOnMap ? (
          <button type="button" className="modal-locate" onClick={onLocateOnMap}>
            <Icon icon="map" />
            Ver en mapa
          </button>
        ) : null}
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        {guide ? (
          <GuideView guide={guide} initialSectionId={initialSectionId} />
        ) : (
          <div className="modal-fallback">
            <h2>{point.name}</h2>
            <p>Sin guía disponible todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}
