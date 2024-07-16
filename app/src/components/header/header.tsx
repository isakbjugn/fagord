import { NavLink } from '@remix-run/react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';

import { useToggle } from '../../utils/use-toggle';
import { SearchBar } from '../search-bar/search-bar';
import style from './header.module.css';
import { NavLinks } from './nav-links.client';

export const Header = () => {
  const [isNavOpen, toggleNav, setIsNavOpen] = useToggle(false);
  const [isSearchOpen, toggleSearch] = useToggle(false);

  return (
    <>
      <Navbar dark expand="lg" className={style.navbar}>
        <NavbarToggler onClick={toggleNav} />
        <NavbarBrand className="mr-auto" href="/hjem">
          <img src="/fagord-logo240.png" height="70" width="150" alt="Fagord" />
        </NavbarBrand>
        <NavbarToggler onClick={toggleSearch} className={style.search}>
          <span className="fa fa-search" />
        </NavbarToggler>
        <Collapse isOpen={isNavOpen} navbar>
          <Nav
            navbar
            onClick={() => {
              setIsNavOpen(false);
            }}
          >
            {NavLinks.map((navItem) => (
              <NavItem key={navItem.address}>
                <NavLink className="nav-link text-nowrap" to={navItem.address}>
                  <span className={'fa fa-lg ' + navItem.icon + ' ' + style.icon} /> {navItem.text}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Collapse>
        <Collapse isOpen={isSearchOpen} navbar className="ms-auto">
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
