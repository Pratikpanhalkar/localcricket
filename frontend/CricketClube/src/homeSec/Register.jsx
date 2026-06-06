// Register.jsx

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../userstyles/register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ─── VIEWS ─────────────────────────────────────────────────────────────────────
// "register"       → Create account form
// "login"          → Login form
// "forgotPassword" → Enter email to receive reset link
// "forgotSent"     → Confirmation screen after email is sent

function Register() {
  const navigate = useNavigate();
  const [view, setView] = useState("register"); // current screen

  const [formdata, setFormdata] = useState({ username: "", password: "", email: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
  }, []);

  // ─── HELPERS ──────────────────────────────────────────────────────────────────
  const switchView = (next) => {
    setFormdata({ username: "", password: "", email: "" });
    setForgotEmail("");
    setView(next);
  };

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  // ─── REGISTER ─────────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/register", formdata);
      alert("Register Success! Please log in.");
      switchView("login");
    } catch (err) {
      alert(err.response?.data?.message || "Register Failed");
    }
  };

  // ─── LOGIN ────────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", formdata);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("adminId", response.data.id);
      localStorage.setItem("adminName", response.data.username);
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Username or Password");
    }
  };

  // ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return alert("Please enter your email");

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/forgot-password", { email: forgotEmail });
      setView("forgotSent");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="register-page">
      <div className="container">
        <div className="row register-wrapper align-items-center">

          {/* LEFT SIDE */}
          <div className="col-12 col-lg-6 register-left">

            {/* ── REGISTER FORM ──────────────────────────────────────────── */}
            {view === "register" && (
              <>
                <h1 className="register-heading">UNLOCK YOUR POWER</h1>
                <form onSubmit={handleRegister}>
                  <TextField
                    label="Name"
                    variant="standard"
                    fullWidth
                    name="username"
                    value={formdata.username}
                    onChange={handleChange}
                    className="custom-input"
                  />
                  <TextField
                    label="Email"
                    type="email"
                    variant="standard"
                    fullWidth
                    name="email"
                    value={formdata.email}
                    onChange={handleChange}
                    className="custom-input"
                    sx={{ mt: 3 }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    variant="standard"
                    fullWidth
                    name="password"
                    value={formdata.password}
                    onChange={handleChange}
                    className="custom-input"
                    sx={{ mt: 3 }}
                  />
                  <Button variant="contained" color="success" type="submit" fullWidth sx={{ mt: 4 }}>
                    REGISTER
                  </Button>
                  <p onClick={() => switchView("login")} className="switch-text">
                    Already have an account? Log in
                  </p>
                </form>
              </>
            )}

            {/* ── LOGIN FORM ─────────────────────────────────────────────── */}
            {view === "login" && (
              <>
                <h1 className="register-heading">WELCOME BACK</h1>
                <form onSubmit={handleLogin}>
                  <TextField
                    label="Username"
                    variant="standard"
                    fullWidth
                    name="username"
                    value={formdata.username}
                    onChange={handleChange}
                    className="custom-input"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    variant="standard"
                    fullWidth
                    name="password"
                    value={formdata.password}
                    onChange={handleChange}
                    className="custom-input"
                    sx={{ mt: 3 }}
                  />
                  <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 4 }}>
                    LOGIN
                  </Button>

                  {/* Forgot password link */}
                  <p
                    onClick={() => switchView("forgotPassword")}
                    className="switch-text"
                    style={{ marginTop: "12px", fontSize: "13px", color: "#1565C0", cursor: "pointer" }}
                  >
                    Forgot password?
                  </p>

                  <p onClick={() => switchView("register")} className="switch-text">
                    Create new account
                  </p>
                </form>
              </>
            )}

            {/* ── FORGOT PASSWORD — EMAIL ENTRY ───────────────────────────── */}
            {view === "forgotPassword" && (
              <>
                <h1 className="register-heading">RESET PASSWORD</h1>
                <p style={{ color: "#aaa", marginBottom: "24px", fontSize: "14px" }}>
                  Enter the email linked to your account and we'll send you a reset link.
                </p>
                <form onSubmit={handleForgotPassword}>
                  <TextField
                    label="Email Address"
                    type="email"
                    variant="standard"
                    fullWidth
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="custom-input"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    sx={{ mt: 4 }}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "SEND RESET LINK"}
                  </Button>
                  <p onClick={() => switchView("login")} className="switch-text">
                    ← Back to login
                  </p>
                </form>
              </>
            )}

            {/* ── FORGOT PASSWORD — SENT CONFIRMATION ─────────────────────── */}
            {view === "forgotSent" && (
              <>
                <h1 className="register-heading">CHECK YOUR EMAIL</h1>
                <p style={{ color: "#ccc", fontSize: "15px", lineHeight: "1.6", marginTop: "16px" }}>
                  If <strong style={{ color: "#fff" }}>{forgotEmail}</strong> is registered with LocalCric,
                  a password reset link has been sent to that address.
                </p>
                <p style={{ color: "#aaa", fontSize: "13px", marginTop: "12px" }}>
                  The link expires in <strong style={{ color: "#fff" }}>1 hour</strong>.
                  Check your spam folder if you don't see it.
                </p>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 4 }}
                  onClick={() => switchView("login")}
                >
                  BACK TO LOGIN
                </Button>
                <p
                  onClick={() => switchView("forgotPassword")}
                  className="switch-text"
                  style={{ fontSize: "13px" }}
                >
                  Didn't receive it? Try again
                </p>
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="col-12 col-lg-6 d-flex justify-content-center">
            <img src="./login.jpg" alt="login" className="register-image" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;