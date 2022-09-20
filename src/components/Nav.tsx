// nav bar with logo

import React from "react";
import logo from '../stackline_logo.svg';
import './nav.css';

// return the bar with logo
function Nav() {
    return (
      <div className="nav-box">
        <img src={logo} alt ="logo"/>
      </div>
    );
  }
  
export default Nav;
  