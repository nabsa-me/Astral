import { useEffect } from 'react';
import GuideView from './guide/GuideView.jsx';

export default function PoiModal({ point, guide, initialSectionId, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          x
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
