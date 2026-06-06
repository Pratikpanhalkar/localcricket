import React from "react";
import "../userstyles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      
      {/* Social Icons */}
      <div className="social-icons">
        <i className="fab fa-facebook-f"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-x-twitter"></i>
        <i className="fab fa-youtube"></i>
      </div>

      {/* Links */}
      <div className="footer-links">
        <a href="#">About</a>
        <a href="#">Jobs</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms Of Service</a>
        <a href="#">Paid Service Terms</a>
        <a href="#">Pro Policy</a>
      </div>

      <hr />

      {/* Bottom text */}
      <p className="footer-bottom">
        © ProInn Pvt Ltd. All rights reserved. CIN U72901GJ2016PTC092938
      </p>
    </footer>
  );
}

export default Footer;