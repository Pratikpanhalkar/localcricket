import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./MatchPlayers.css";

function MatchPlayers() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchId, setMatchId] = useState("");
  const [teamAIds, setTeamAIds] = useState("");
  const [teamBIds, setTeamBIds] = useState("");

  useEffect(() => {
    getPlayers();
    getMatches();
  }, []);

  const getPlayers = async () => {
    try {
      const res = await api.get("/GetPlayers");
      setPlayers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMatches = async () => {
    try {
      const res = await api.get("/GetMatches");
      setMatches(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/AddPlayersToMatch", { matchId, teamAIds, teamBIds });
      alert(res.data.message);
      setTeamAIds("");
      setTeamBIds("");
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  const handleDelete = async (playerId, playerName) => {
    if (!window.confirm(`Remove "${playerName}" from your squad?`)) return;
    try {
      await api.delete(`/DeletePlayer/${playerId}`);
      setPlayers((prev) => prev.filter((p) => p.Player_id !== playerId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete player");
    }
  };

  return (
    <div className="assign-container">

      {/* ── left: assign form ── */}
      <div className="assign-card">
        <div className="icon-circle">🏏</div>
        <h1>Assign Players</h1>
        <p>Enter comma-separated player IDs for each team</p>

        <form className="assign-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Match</label>
            <div className="select-wrapper">
              <select
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                required
              >
                <option value="">Select a match</option>
                {matches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.team1_name} vs {match.team2_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Team A — Player IDs</label>
            <textarea
              placeholder="e.g. 1, 2, 3, 4, 5"
              value={teamAIds}
              onChange={(e) => setTeamAIds(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Team B — Player IDs</label>
            <textarea
              placeholder="e.g. 7, 8, 9, 10, 11"
              value={teamBIds}
              onChange={(e) => setTeamBIds(e.target.value)}
              required
            />
          </div>

          <div className="form-divider" />
          <button type="submit">Assign Players</button>
        </form>
      </div>

      {/* ── right: player reference table ── */}
      <div className="player-table">
        <h2>Available Players</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const isCaptain = player.playerrole?.includes("-C");
              return (
                <tr key={player.Player_id}>
                  <td>{player.Player_id}</td>
                  <td>{player.playerName}</td>
                  <td>
                    <span className={`role-badge ${isCaptain ? "captain" : ""}`}>
                      {player.playerrole}
                    </span>
                  </td>
                  <td className="action-btns">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/PlayerProfile/${player.Player_id}`)}
                    >
                      View
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => handleDelete(player.Player_id, player.playerName)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default MatchPlayers;