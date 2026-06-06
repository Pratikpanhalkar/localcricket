import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Sidemenu from "./Sidemenu";


function Anavbar() {
  return (
    <nav
      className="navbar navbar-dark border-bottom shadow-sm"
      style={{
        backgroundColor: "#111",
        borderColor: "#222",

        /* Sticky Navbar */
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Website Name */}
        <a
          className="navbar-brand m-0 fw-bold"
          style={{
            fontSize: "2rem",
            color: "#f5c542",
            letterSpacing: "4px",
            textDecoration: "none",
          }}
        >
          INNINGS PRO
        </a>
          
          <Sidemenu/>

      </div>
    </nav>
  );
}

export default Anavbar;