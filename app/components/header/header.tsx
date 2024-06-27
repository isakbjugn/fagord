import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';

import style from './header.module.css';
import { navLinks } from './nav-links';
import { NavLink } from '@remix-run/react';
import { useToggle } from '~/utils/use-toggle';
import { SearchBar } from '~/components/search-bar/search-bar';
import fagordLogo from '/fagord-logo240.png?url';

export const Header = (): JSX.Element => {
  const [isNavOpen, toggleNav, setIsNavOpen] = useToggle(false);
  const [isSearchOpen, toggleSearch] = useToggle(false);

  return (
    <>
      <Navbar aria-hidden dark expand="lg" className={style.navbar}>
        <NavbarToggler aria-hidden onClick={toggleNav} />
        <NavbarBrand className="mr-auto" href="/hjem">
          <img src={fagordLogo} height="70" width="150" alt="Fagord" />
        </NavbarBrand>
        <NavbarToggler aria-hidden onClick={toggleSearch} className={style.search}>
          <span className="fa fa-search" />
        </NavbarToggler>
        <Collapse isOpen={isNavOpen} navbar>
          <Nav
            navbar
            onClick={() => {
              setIsNavOpen(false);
            }}
          >
            {navLinks.map((navItem) => (
              <NavItem key={navItem.address}>
                <NavLink className="nav-link text-nowrap" to={navItem.address}>
                  <span className={'fa fa-lg ' + navItem.icon + ' ' + style.icon} /> {navItem.text}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Collapse>
        <Collapse aria-hidden isOpen={isSearchOpen} navbar className="ms-auto">
          <Nav navbar>
            <NavItem>
              <SearchBar />
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};
