import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./Match.css";

function Match() {
  const navigate = useNavigate();

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [overs, setOvers] = useState("");
  const [matchDate, setMatchDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/CreateMatch", { team1, team2, overs, matchDate });
      alert(res.data.message);
      setTeam1("");
      setTeam2("");
      setOvers("");
      setMatchDate("");
    } catch (err) {
      console.log(err);
      alert("Failed to create match");
    }
  };

  return (
    <div className="match-container">
      <div className="match-card">

        <button className="M-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="icon-circle">🏆</div>
        <h1>Create Match</h1>
        <p>Add teams for the match</p>

        <form className="match-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Team 1 Name"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Team 2 Name"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Overs"
            value={overs}
            onChange={(e) => setOvers(e.target.value)}
            required
          />
          <input
            type="date"
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
            required
          />
          <button type="submit">Create Match</button>
        </form>

      </div>
    </div>
  );
}

export default Match;