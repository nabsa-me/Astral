import type { ReactNode } from 'react';

export type MenuCardVariant = 'sidebar' | 'dropdown' | 'dropdown-compact';

export interface IMenuCardProps {
  label: ReactNode;
  icon?: string;
  variant?: MenuCardVariant;
  isDanger?: boolean;
  active?: boolean;
  disabled?: boolean;
  trailing?: ReactNode;
  onClick?: () => void;
}
