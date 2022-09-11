import classNames from 'classnames';
import {
  Navbar,
  NavbarBrand,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";

const SideBar = ({isOpen}: SideBarProps) => {
  <div className={classNames("sidebar", {"is-open": isOpen})}>
    <div className="side-menu">
      <Navbar vertical className="list-unstyled pb-3">
        
      <NavbarBrand className="mr-auto" href="/">
        <img
          src="assets/images/fagord-logo.png"
          height="70"
          width="150"
          alt="Fagord"
        />
      </NavbarBrand>
      <NavItem>
        <NavLink className="nav-link" to="/hjem">
          <span className="fa fa-home fa-lg" /> Hjem
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
    </Navbar>
  </div>
</div>
}

interface SideBarProps {
  isOpen: boolean
}

export default SideBar;