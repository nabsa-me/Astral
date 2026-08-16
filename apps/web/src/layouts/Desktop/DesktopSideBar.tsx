import { useLocation, useNavigate } from 'react-router';
import { APP_ROUTES } from '../../app/appRoutes';
import { NAV_ITEMS } from '../../app/navItems';
import { MenuCard } from '../../shared/components/navigationCards/MenuCard';
import { Divider } from '../../shared/components/misc/misc';
import type { IDesktopSideBarProps } from './desktopTypes';

// A trip detail belongs under "Mis rutas"; a diary detail under "Diarios".
const isSectionActive = (navPath: string, pathname: string): boolean => {
  if (navPath === APP_ROUTES.home) return pathname === '/';
  if (navPath === APP_ROUTES.myRoutes) return pathname.startsWith('/my-routes') || pathname.startsWith('/trips/');
  if (navPath === APP_ROUTES.diaries) return pathname.startsWith('/diaries');
  return pathname === navPath || pathname.startsWith(navPath + '/');
};

const DesktopSideBar = ({ sideBarHidden }: IDesktopSideBarProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className={`desktop-sideBar ${sideBarHidden}`}>
      <div className={`desktop-sideBar-body ${sideBarHidden}`}>
        <div className="desktop-sideBar-body-inner">
          <div className="desktop-sideBar-fixedTop">
            <nav className="desktop-sideBar-fixedTop-content">
              {NAV_ITEMS.map((navItem) => (
                <MenuCard
                  key={navItem.path}
                  label={navItem.label}
                  icon={navItem.icon}
                  active={isSectionActive(navItem.path, pathname)}
                  onClick={() => navigate(navItem.path)}
                />
              ))}
            </nav>
          </div>
          <Divider />
          <div className="desktop-sideBar-body-scrollable">
            <div className="desktop-sideBar-body-content">
              <p className="desktop-sideBar-hint">
                Comparte tus rutas y crea diarios de tus viajes. Pronto podrás seguir a otros
                viajeros y reaccionar a sus aventuras.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Divider />
    </div>
  );
};

export default DesktopSideBar;
