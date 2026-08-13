import type { ReactNode } from 'react';
import { Icon } from '../icons/icons';

export interface IEmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, subtitle, action }: IEmptyStateProps) => (
  <div className="empty-state">
    {icon ? (
      <span className="empty-state-icon">
        <Icon icon={icon} />
      </span>
    ) : null}
    <h3 className="empty-state-title">{title}</h3>
    {subtitle ? <p className="empty-state-subtitle">{subtitle}</p> : null}
    {action ? <div className="empty-state-action">{action}</div> : null}
  </div>
);
