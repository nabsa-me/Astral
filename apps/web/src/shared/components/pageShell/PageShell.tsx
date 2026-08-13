import type { ReactNode } from 'react';

export interface IPageShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const PageShell = ({ title, subtitle, actions, children }: IPageShellProps) => (
  <div className="page">
    <div className="page-inner">
      <header className="page-header">
        <div className="page-heading">
          <h1 className="page-title">{title}</h1>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="page-actions">{actions}</div> : null}
      </header>
      <div className="page-content">{children}</div>
    </div>
  </div>
);
