import { useState } from 'react';
import { Outlet } from 'react-router';
import DesktopNavBar from './DesktopNavBar';
import DesktopSideBar from './DesktopSideBar';
import type { shownOrHiddenType } from './desktopTypes';

const DesktopLayout = () => {
  const [sideBarHidden, setSideBarHidden] = useState<shownOrHiddenType>('');

  return (
    <div className="desktop-appRoot-fullPage">
      <DesktopNavBar setSideBarHidden={setSideBarHidden} sideBarHidden={sideBarHidden} />
      <div className="desktop-main">
        <DesktopSideBar sideBarHidden={sideBarHidden} />
        <Outlet />
      </div>
    </div>
  );
};

export default DesktopLayout;
