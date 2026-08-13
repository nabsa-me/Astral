import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from '../../shared/components/icons/icons';
import { APP_ROUTES } from '../../app/appRoutes';
import type { IDesktopNavBarProps } from './desktopTypes';

const DesktopNavBar = ({ setSideBarHidden, sideBarHidden }: IDesktopNavBarProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const toggleSideBar = () => setSideBarHidden(sideBarHidden === 'hidden' ? '' : 'hidden');

  return (
    <header className="desktop-navBar">
      <button
        type="button"
        className="burger-button-container"
        aria-label="Mostrar u ocultar el menú lateral"
        onClick={toggleSideBar}
      >
        <Icon icon={sideBarHidden === 'hidden' ? 'menu' : 'menu_open'} type="thin" />
      </button>
      <span className="astral-wordmark" onClick={() => navigate(APP_ROUTES.home)} role="link">
        Astral
      </span>
      <div className="search-bar-container">
        <span className="search-bar-icon">
          <Icon icon="search" type="thin" />
        </span>
        <form className="search-bar-form" onSubmit={(event) => event.preventDefault()}>
          <input
            className="search-bar-input"
            type="search"
            placeholder="Buscar rutas, diarios y viajeros…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Buscar"
          />
        </form>
      </div>
      <div className="navbar-user-menu">
        <div className="navbar-avatar" title="Tu perfil">
          N
        </div>
      </div>
    </header>
  );
};

export default DesktopNavBar;
