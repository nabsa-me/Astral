import type { IDividerProps } from './miscTypes';

export const Divider = ({ className }: IDividerProps) => (
  <div className={`divider ${className ?? ''}`.trim()} />
);
