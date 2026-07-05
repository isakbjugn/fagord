import { useEffect } from 'react';
import { NavLink, useLocation, useNavigation, useRouteLoaderData } from 'react-router';

import style from '~/styles/header.module.css';

import { navLinks } from '../nav-links';
import { Search } from './search';
import FagordLogo from './fagord-logo.svg?react';

// Bootstrap-bundelen (lastet via <script> i root.tsx) legger seg på window.bootstrap.
// Vi bruker bare Collapse.getOrCreateInstance(...).hide(), så vi typer akkurat det –
// prosjektet har ikke @types/bootstrap.
declare global {
  interface Window {
    bootstrap?: {
      Collapse: {
        getOrCreateInstance: (element: Element) => { hide: () => void };
      };
    };
  }
}

export const Header = () => {
  const location = useLocation();
  const { search } = location;

  // Vi bruker IKKE data-bs-toggle på navigasjonslenkene: Bootstrap kaller
  // preventDefault() på klikk mot <a>-elementer (se collapse.js), noe som ville stoppe
  // React Routers klientnavigering. I stedet lukker vi mobilmenyen som en effekt av at
  // ruten faktisk endrer seg. Vi rører den bare når den er åpen (klassen `show`), så på
  // brede skjermer – der navbar-expand-lg holder menyen åpen uten `show` – gjør vi
  // ingenting, og unngår collapse-animasjonen som ellers fikk menyen til å blinke.
  useEffect(() => {
    const meny = document.getElementById('navigasjonsmeny');
    if (meny?.classList.contains('show')) {
      window.bootstrap?.Collapse.getOrCreateInstance(meny).hide();
    }
  }, [location.pathname]);

  // Header er en delt layout-komponent som også rendres uten root-loaderen (tester,
  // ruter uten data). `useRouteLoaderData` gir `undefined` i de tilfellene i stedet
  // for å kaste, så vi faller trygt tilbake på «ikke innlogget».
  const rootData = useRouteLoaderData<{ isLoggedIn: boolean }>('root');
  const isLoggedIn = rootData?.isLoggedIn ?? false;
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const userProfileLink = isLoggedIn ? '/logg-ut' : '/logg-inn';
  const userProfileText = isLoggedIn ? 'Logg ut' : 'Logg inn';

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
            <li className="nav-item" key="user">
              <NavLink className="nav-link text-nowrap" to={{ pathname: userProfileLink }}>
                <span className="fa fa-user" /> {userProfileText}
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="collapse navbar-collapse ms-auto" id="søkefelt">
          <Search />
        </div>
      </div>
    </nav>
  );
};
