import { Icon } from '../../shared/components/icons/icons';

interface ReviewStarsProps {
  rating: number; // 1..5
}

/** Renders a 1–5 star rating (filled up to `rating`). */
export default function ReviewStars({ rating }: ReviewStarsProps) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="review-stars" aria-label={`${value} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} icon="star" type={i < value ? 'filled' : ''} />
      ))}
    </span>
  );
}
