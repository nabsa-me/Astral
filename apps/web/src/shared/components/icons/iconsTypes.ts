import { AriaAttributes, JSX, Ref } from 'react';

export type IconType = 'bold' | 'filled' | 'thin' | '';
export type IconRole = 'button';
export type IconVariant = 'default' | 'filled' | 'bold' | 'thin';
export type IconComponent = () => JSX.Element;

export interface IIconComponentMap {
  [iconName: string]: Partial<Record<IconVariant, IconComponent>>;
}

export interface IIconProps {
  icon: string;
  className?: string;
  type?: IconType;
  role?: IconRole;
}

export interface IIconButtonProps {
  icon: string;
  ariaLabel: string;
  type?: Exclude<IconType, ''>;
  className?: string;
  onClick?: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
  ariaProps?: AriaAttributes;
  disabled?: boolean;
  isOpen?: boolean;
}
