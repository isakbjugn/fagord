import { NavLink, useLocation, useNavigation } from 'react-router';

import style from '~/styles/header.module.css';

import { navLinks } from '../nav-links';
import { Search } from './search';
import FagordLogo from './fagord-logo.svg?react';

export const Header = () => {
  const { search } = useLocation();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

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
          <FagordLogo className={isLoading ? style.loading : undefined} />
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
        <div className="mx-3">
          <NavLink className="nav-link" to={{ pathname: '/logg-inn' }}>
            <span className="fa fa-user" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
