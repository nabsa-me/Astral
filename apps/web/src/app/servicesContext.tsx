import { createContext, useContext, type ReactNode } from 'react';
import type { AppServices } from './services';

const ServicesContext = createContext<AppServices | null>(null);

export const ServicesProvider = ({
  services,
  children,
}: {
  services: AppServices;
  children: ReactNode;
}) => <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;

export const useServices = (): AppServices => {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('useServices must be used within a ServicesProvider');
  return services;
};
