import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const Menu = (props) => {
  const [style, setStyle] = useState({});

  const navigate = useNavigate();

  const handleStyle = (style) => ({
    color: style.isActive ? "white" : "lightGrey",
    textDecoration: "none"
  });

  const handleLogout = () => {
    localStorage.clear();
    props.setIsUserAuthorized(false);
    navigate("/login");
  };

  const handleNavLinkClick = () => {
    if (Object.keys(style).length > 0) {
      setStyle({});
    }
  };

  return (
    <div className="menu">
      <div className="menu-items" style={style}>
        {props.isUserAuthorized ?
          <div className="menu-group">
            <NavLink to="/" onClick={handleNavLinkClick} style={handleStyle}>
              <Typography variant="body1">Posts</Typography>
            </NavLink>
            <Typography variant="body1" className="logout" onClick={handleLogout}>Logout</Typography>
          </div> :
          <div className="menu-group">
            <NavLink to="/login" onClick={handleNavLinkClick} style={handleStyle}>
              <Typography variant="body1">Login</Typography>
            </NavLink>
            <NavLink to="/registration" onClick={handleNavLinkClick} style={handleStyle}>
              <Typography variant="body1">Registration</Typography>
            </NavLink>
          </div>
        }
      </div>
    </div>
  );
};

export default Menu;