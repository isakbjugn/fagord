import { NavLink } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Collapse,
  NavbarToggler,
  Form,
  Button,
  Input
} from "reactstrap";
import useToggle from "./utils/use-toggle"

const Header = () => {
  const [isNavOpen, toggleNav, setIsNavOpen] = useToggle(false);
  const [isSearchOpen, toggleSearch] = useToggle(false);

  return (
    <>
      <Navbar dark expand="md">
        <NavbarToggler onClick={toggleNav} />
        <NavbarBrand className="mr-auto" href="/">
          <img
            src="assets/images/fagord-logo.png"
            height="70"
            width="150"
            alt="Fagord"
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggleSearch}>
          <span className="fa fa-search" />
        </NavbarToggler>        
        <Collapse isOpen={isNavOpen} navbar>
          <Nav navbar onClick={() => setIsNavOpen(false)}>
            <NavItem>
              <NavLink className="nav-link text-nowrap" to="/hjem">
                <span className="fa fa-home fa-lg" /> Hjem
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link text-nowrap" to="/termliste">
                <span className="fa fa-book fa-lg" /> Termliste
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link text-nowrap" to="/om">
                <span className="fa fa-info fa-lg" /> Om oss
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link text-nowrap" to="/kontakt">
                <span className="fa fa-address-card fa-lg" /> Kontakt oss
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse> 
        <Collapse isOpen={isSearchOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Form className="d-flex">
              <Input
                id="search"
                name="search"
                placeholder="Søk"
                type="search"
              />
              <Button variant="outline-success" type="submit">Søk</Button>
            </Form>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
}

export default Header;