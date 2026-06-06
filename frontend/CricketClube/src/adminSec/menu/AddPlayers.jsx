import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import "./Addplayer.css";

function Addplayers() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/Addplayer", { name, role });
      alert("Player Added Successfully");
      setName("");
      setRole("");
    } catch (err) {
      console.log(err);
      alert("Failed to Add Player");
    }
  };

  return (
    <div className="add-player-container">
      <div className="player-card">
        <button className="A-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="icon-circle">🏏</div>
        <h1>Add Player</h1>
        <p>Register a new player to the squad</p>

        <form className="player-form" onSubmit={handleSubmit}>

          <div className="form-field">
            <label>Player name</label>
            <input
              type="text"
              placeholder="e.g. Rohit Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Role</label>
            <div className="select-wrapper">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select player role</option>
                <optgroup label="Standard">
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All Rounder">All Rounder</option>
                  <option value="Wicket Keeper">Wicket Keeper</option>
                </optgroup>
                <optgroup label="Captain">
                  <option value="Batsman-C">Batsman (C)</option>
                  <option value="Bowler-C">Bowler (C)</option>
                  <option value="All Rounder-C">All Rounder (C)</option>
                  <option value="Wicket Keeper-C">Wicket Keeper (C)</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="form-divider"></div>

          <button type="submit">Add Player</button>

        </form>

        <p className="form-footer-note">
          Player will be available for match selection after saving
        </p>

      </div>
    </div>
  );
}

export default Addplayers;