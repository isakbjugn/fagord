import { NavLink, useLocation } from '@remix-run/react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';

import { useToggle } from '../../utils/use-toggle';
import style from './header.module.css';
import { navLinks } from './nav-links';
import { Search } from '../search/search';

export const Header = () => {
  const [isNavOpen, toggleNav, setIsNavOpen] = useToggle(false);
  const [isSearchOpen, toggleSearch] = useToggle(false);
  const { search } = useLocation();

  return (
    <Navbar dark expand="lg" className={style.navbar}>
      <NavbarToggler onClick={toggleNav} />
      <NavbarBrand className="mr-auto" href="/">
        <img src="/fagord-logo240.png" height="70" width="150" alt="Fagord" />
      </NavbarBrand>
      <NavbarToggler onClick={toggleSearch} className={style.search}>
        <span aria-hidden className="fa fa-search" />
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
              <NavLink className="nav-link text-nowrap" to={{ pathname: navItem.address, search: search }}>
                <span aria-hidden className={'fa fa-lg ' + navItem.icon + ' ' + style.icon} /> {navItem.text}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Collapse>
      <Collapse isOpen={isSearchOpen} navbar className="ms-auto">
        <Search />
      </Collapse>
    </Navbar>
  );
};
