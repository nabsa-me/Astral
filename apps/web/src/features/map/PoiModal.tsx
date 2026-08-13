import { useEffect } from 'react';
import GuideView from '../guide/GuideView';
import type { IPointOfInterest } from '../../domain/entities/PointOfInterest';
import type { IRoute } from '../../domain/entities/Route';
import type { IGuide } from '../../domain/entities/Guide';

interface PoiModalProps {
  point: IPointOfInterest | IRoute;
  guide: IGuide | null;
  initialSectionId: string | null;
  onClose: () => void;
}

export default function PoiModal({ point, guide, initialSectionId, onClose }: PoiModalProps) {
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
