import { NavLink, useLocation } from 'react-router';

import style from '~/styles/header.module.css';

import { navLinks } from '../nav-links';
import { Search } from './search';

export const Header = () => {
  const { search } = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <a
          className="navbar-toggler"
          aria-label="Åpne/lukk navigasjonsmeny"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navigasjonsmeny"
        >
          <span className="navbar-toggler-icon" />
        </a>
        <a className="mr-auto navbar-brand" href="/hjem">
          <img src="/fagord-logo240.png" height="70" width="150" alt="Fagord" />
        </a>
        <button
          className={`navbar-toggler ${style.search}`}
          aria-label="Åpne/lukk søkefeltet"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#søkefelt"
        >
          <span aria-hidden className="fa fa-search" />
        </button>
        <div className="collapse navbar-collapse" id="navigasjonsmeny">
          <ul className="navbar-nav">
            {navLinks.map((navItem) => (
              <li className="nav-item" key={navItem.address}>
                <NavLink className="nav-link text-nowrap" to={{ pathname: navItem.address, search: search }}>
                  <span aria-hidden className={'fa fa-lg ' + navItem.icon + ' ' + style.icon} /> {navItem.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="collapse navbar-collapse ms-auto" id="søkefelt">
          <Search />
        </div>
      </div>
    </nav>
  );
};
