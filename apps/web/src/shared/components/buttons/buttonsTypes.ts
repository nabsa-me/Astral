import type { AriaAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'medium' | 'compact';

export interface IButtonProps {
  label: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface ISquareButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'className' | 'onClick'
> {
  ariaLabel: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
  ariaProps?: AriaAttributes;
}
