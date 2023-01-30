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

const Header = (): JSX.Element => {
  const [isNavOpen, toggleNav, setIsNavOpen] = useToggle(false);
  const [isSearchOpen, toggleSearch] = useToggle(false);

  return (
    <>
      <Navbar dark expand="md" className={styles.navbar}>
        <NavbarToggler onClick={toggleNav} />
        <NavbarBrand className="mr-auto" href="/">
          <img src="fagord-logo240.png" height="70" width="150" alt="Fagord" />
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
            <NavItem>
              <NavLink className="nav-link text-nowrap" to="/hjem">
                <span className={'fa fa-home fa-lg ' + styles.icon} /> Hjem
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link text-nowrap" to="/termliste">
                <span className={'fa fa-book fa-lg ' + styles.icon} /> Termliste
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link text-nowrap" to="/ny-term">
                <span className={'fa fa-lightbulb-o fa-lg ' + styles.icon} /> Ny
                term
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link text-nowrap" to="/om">
                <span className={'fa fa-info fa-lg ' + styles.icon} /> Om oss
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link text-nowrap" to="/kontakt">
                <span className={'fa fa-address-card ' + styles.icon} /> Kontakt
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
        <Collapse isOpen={isSearchOpen} navbar>
          <Nav className="ml-auto" navbar>
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
