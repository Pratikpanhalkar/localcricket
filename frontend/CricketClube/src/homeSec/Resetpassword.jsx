// ResetPassword.jsx
// Mounted at route: /reset-password
// Reads ?token=...&id=... from the URL, lets the user set a new password.

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // If no token/id in URL, show an error immediately
  if (!token || !userId) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Invalid Link</h2>
          <p style={styles.subtext}>
            This password reset link is missing required information. Please request a new one.
          </p>
          <Button variant="contained" fullWidth onClick={() => navigate("/")}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/reset-password", {
        userId,
        token,
        newPassword,
      });
      setDone(true);
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={{ ...styles.heading, color: "#4caf50" }}>Password Updated!</h2>
          <p style={styles.subtext}>
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <Button variant="contained" color="success" fullWidth onClick={() => navigate("/")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Set New Password</h2>
        <p style={styles.subtext}>Choose a strong password — at least 6 characters.</p>

        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            variant="standard"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="standard"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mt: 3 }}
            InputLabelProps={{ style: { color: "#aaa" } }}
            InputProps={{ style: { color: "#fff" } }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 4 }}
            disabled={loading}
          >
            {loading ? "Saving..." : "RESET PASSWORD"}
          </Button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f1923",
  },
  card: {
    background: "#1a2636",
    borderRadius: "12px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  heading: {
    color: "#fff",
    marginBottom: "8px",
    fontSize: "22px",
    fontWeight: 700,
  },
  subtext: {
    color: "#aaa",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "8px",
  },
};

export default ResetPassword;