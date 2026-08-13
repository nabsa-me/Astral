interface DiaryGalleryProps {
  photos: string[];
  alt: string;
}

/** Responsive photo grid for a diary entry (a "step" in the story). */
export default function DiaryGallery({ photos, alt }: DiaryGalleryProps) {
  if (photos.length === 0) return null;
  return (
    <div className={`diary-gallery count-${Math.min(photos.length, 3)}`}>
      {photos.map((src, i) => (
        <figure key={src} className="diary-photo">
          <img src={src} alt={`${alt} — foto ${i + 1}`} loading="lazy" />
        </figure>
      ))}
    </div>
  );
}
