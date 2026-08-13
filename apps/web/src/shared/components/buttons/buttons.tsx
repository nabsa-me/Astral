import type { IButtonProps, ISquareButtonProps } from './buttonsTypes';

export const Button = ({
  label,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
}: IButtonProps) => (
  <button
    type={type}
    className={`button button--${variant} button--size-${size} ${className}`.trim()}
    disabled={isLoading || disabled}
    onClick={onClick}
  >
    {isLoading ? <div className="button-spinner" /> : label}
  </button>
);

export const SquareButton = ({
  ariaLabel,
  className = '',
  children,
  onClick,
  buttonRef,
  ariaProps,
  ...rest
}: ISquareButtonProps) => (
  <button
    ref={buttonRef}
    type="button"
    className={`square-button ${className}`.trim()}
    aria-label={ariaLabel}
    onClick={onClick}
    {...rest}
    {...ariaProps}
  >
    {children}
  </button>
);
