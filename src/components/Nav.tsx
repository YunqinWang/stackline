import React from "react";
import logo from '../stackline_logo.svg';
import './nav.css';

type Props = {
  NavLogo: HTMLImageElement,
}

function Nav() {
    return (
      <div className="nav-box">
        <img src={logo}/>
      </div>
    );
  }
  
export default Nav;
  