import { useState } from "react";
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

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  return (
    <>
      <Navbar dark expand="md">
        <div className="container-fluid">
          <NavbarBrand className="mr-auto" href="/">
            <img
              src="assets/images/fagord-logo.png"
              height="70"
              width="150"
              alt="Fagord"
            />
          </NavbarBrand>
          <NavbarToggler onClick={toggleNav} />
          <Collapse isOpen={isNavOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink className="nav-link" to="/hjem">
                  <span className="fa fa-home fa-lg" /> Hjem
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/termliste">
                  <span className="fa fa-book fa-lg" /> Termliste
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/om">
                  <span className="fa fa-info fa-lg" /> Om oss
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to="/kontakt">
                  <span className="fa fa-address-card fa-lg" /> Kontakt oss
                </NavLink>
              </NavItem>
            </Nav>
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
        </div>
        
      </Navbar>
    </>
  );
}

export default Header;