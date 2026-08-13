import { useLocation, useNavigate } from 'react-router';
import { NAV_ITEMS } from '../../app/navItems';
import { MenuCard } from '../../shared/components/navigationCards/MenuCard';
import { Divider } from '../../shared/components/misc/misc';
import type { IDesktopSideBarProps } from './desktopTypes';

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
                  active={pathname === navItem.path}
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
