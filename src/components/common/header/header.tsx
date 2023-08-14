import { NavLink } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Collapse,
  NavbarToggler,
} from 'reactstrap';
import SearchBar from '../search-bar/search-bar';
import useToggle from '../../utils/use-toggle';
import styles from './header.module.css';
import { NavLinks } from './nav-links';

const Header = (): JSX.Element => {
  const [isNavOpen, toggleNav, setIsNavOpen] = useToggle(false);
  const [isSearchOpen, toggleSearch] = useToggle(false);

  return (
    <>
      <Navbar dark expand="lg" className={styles.navbar}>
        <NavbarToggler onClick={toggleNav} />
        <NavbarBrand className="mr-auto" href="/hjem">
          <img src="/fagord-logo240.png" height="70" width="150" alt="Fagord" />
        </NavbarBrand>
        <NavbarToggler onClick={toggleSearch} className={styles.search}>
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
                  <span
                    className={'fa fa-lg ' + navItem.icon + ' ' + styles.icon}
                  />{' '}
                  {navItem.text}
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

export default Header;
