import { Icon } from '../icons/icons';
import type { IMenuCardProps } from './navigationCardsTypes';

export const MenuCard = ({
  label,
  icon,
  variant = 'sidebar',
  isDanger = false,
  active = false,
  disabled = false,
  trailing,
  onClick,
}: IMenuCardProps) => {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <div
      className={`menu-card menu-card--${variant}`}
      data-active={(variant === 'sidebar' && active && !disabled) || undefined}
      data-danger={isDanger || undefined}
      role="button"
      aria-disabled={disabled || undefined}
      onClick={handleClick}
    >
      {icon ? <Icon icon={icon} /> : null}
      <span className="menu-card-label">{label}</span>
      {trailing ? (
        <span className="menu-card-trailing" onClick={(event) => event.stopPropagation()}>
          {trailing}
        </span>
      ) : null}
    </div>
  );
};
