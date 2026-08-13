import { IconComponent, IconType, IconVariant, IIconButtonProps, IIconProps } from './iconsTypes';
import { iconComponentMap } from './iconsSvgs';

const resolveVariant = (type: IconType): IconVariant => (type === '' ? 'default' : type);

const resolveIconComponent = (iconName: string, variant: IconVariant): IconComponent | null =>
  iconComponentMap[iconName]?.[variant] ?? iconComponentMap[iconName]?.default ?? null;

export const Icon = ({ icon, type = '', className = '', role }: IIconProps) => {
  const SvgComponent = resolveIconComponent(icon, resolveVariant(type));
  const classes = ['icon', className].filter(Boolean).join(' ');
  const content = SvgComponent ? <SvgComponent /> : null;

  if (role)
    return (
      <span className={classes} role={role} aria-label={icon}>
        {content}
      </span>
    );

  return (
    <span className={classes} aria-hidden="true">
      {content}
    </span>
  );
};

export const IconButton = ({
  icon,
  ariaLabel,
  type,
  className = '',
  onClick,
  buttonRef,
  ariaProps,
  disabled = false,
  isOpen = false,
}: IIconButtonProps) => {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`icon-button ${className}`.trim()}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      data-open={isOpen || undefined}
      onClick={handleClick}
      {...ariaProps}
    >
      <Icon icon={icon} type={type} />
    </button>
  );
};
