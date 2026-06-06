import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function Navbar() {
  const isMobile = window.innerWidth <= 480;

  return (
    <nav
      className="navbar navbar-dark border-bottom shadow-sm"
      style={{
        backgroundColor: "#111",
        borderColor: "#222",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        className="container-fluid d-flex justify-content-between align-items-center"
        style={{
          paddingLeft: isMobile ? "10px" : "16px",
          paddingRight: isMobile ? "10px" : "16px",
        }}
      >
        <a
          className="navbar-brand m-0 fw-bold"
          style={{
            fontSize: isMobile ? "1.1rem" : "2rem",
            color: "#f5c542",
            letterSpacing: isMobile ? "1px" : "4px",
            textDecoration: "none",
          }}
        >
          INNINGS PRO
        </a>

        <Button
          variant="outlined"
          sx={{
            borderColor: "#fff",
            color: "#fff",
            fontSize: isMobile ? "12px" : "14px",
            minWidth: isMobile ? "auto" : "64px",
            "&:hover": {
              borderColor: "#00bcd4",
              backgroundColor: "#1a1a1a",
            },
          }}
        >
          <Link
            className="nav-link"
            to="/register"
            style={{
              color: "inherit",
              textDecoration: "none",
              padding: isMobile ? "0 2px" : "0 5px",
            }}
          >
            Register
          </Link>
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;