import { useEffect } from 'react';
import GuideView from '../guide/GuideView';
import type { IGuide } from '../../domain/entities/Guide';

interface PoiModalProps {
  /** Only the name is rendered in the fallback; any named entity works. */
  point: { name: string };
  guide: IGuide | null;
  initialSectionId: string | null;
  onClose: () => void;
  /** Section ids that have a corresponding pin on the trip map. */
  locatableSectionIds?: Set<string>;
  /** Invoked when the user asks to jump from a section to its pin. */
  onLocateSection?: (sectionId: string) => void;
}

export default function PoiModal({
  point,
  guide,
  initialSectionId,
  onClose,
  locatableSectionIds,
  onLocateSection,
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
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        {guide ? (
          <GuideView
            guide={guide}
            initialSectionId={initialSectionId}
            locatableSectionIds={locatableSectionIds}
            onLocateSection={onLocateSection}
          />
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
