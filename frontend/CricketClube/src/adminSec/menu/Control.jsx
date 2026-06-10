import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./Control.css";

function Control() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");

  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);

  const [battingDataA, setBattingDataA] = useState({});
  const [battingDataB, setBattingDataB] = useState({});
  const [bowlingDataA, setBowlingDataA] = useState({});
  const [bowlingDataB, setBowlingDataB] = useState({});

  const [team1Wickets, setTeam1Wickets] = useState("");
  const [team2Wickets, setTeam2Wickets] = useState("");

  const [selectedMatchData, setSelectedMatchData] = useState(null);

  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = async () => {
    try {
      const res = await api.get("/GetMatches");
      setMatches(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPlayers = async (matchId) => {
    try {
      const match = matches.find((m) => m.id === parseInt(matchId));
      setSelectedMatchData(match);

      const res = await api.get(`/GetMatchPlayers/${matchId}`);

      setTeamAPlayers(res.data.teamA);
      setTeamBPlayers(res.data.teamB);

      setBattingDataA({});
      setBattingDataB({});
      setBowlingDataA({});
      setBowlingDataB({});
      setTeam1Wickets("");
      setTeam2Wickets("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleMatchChange = (e) => {
    const matchId = e.target.value;
    setSelectedMatch(matchId);
    if (matchId) {
      loadPlayers(matchId);
    } else {
      setSelectedMatchData(null);
      setTeamAPlayers([]);
      setTeamBPlayers([]);
    }
  };

  const updateBattingA = (playerId, field, value) => {
    setBattingDataA((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }));
  };

  const updateBattingB = (playerId, field, value) => {
    setBattingDataB((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }));
  };

  const updateBowlingA = (playerId, field, value) => {
    setBowlingDataA((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }));
  };

  const updateBowlingB = (playerId, field, value) => {
    setBowlingDataB((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }));
  };

  const teamARuns = teamAPlayers.reduce((total, player) => {
    return total + Number(battingDataA[player.Player_id]?.runs || 0);
  }, 0);

  const teamBRuns = teamBPlayers.reduce((total, player) => {
    return total + Number(battingDataB[player.Player_id]?.runs || 0);
  }, 0);

  const teamABowlingRuns = teamAPlayers.reduce((total, player) => {
    return total + Number(bowlingDataA[player.Player_id]?.runs_given || 0);
  }, 0);

  const teamBBowlingRuns = teamBPlayers.reduce((total, player) => {
    return total + Number(bowlingDataB[player.Player_id]?.runs_given || 0);
  }, 0);

  const saveMatch = async () => {
    if (!selectedMatch) {
      alert("Please select a match first.");
      return;
    }

    const maxBalls = (selectedMatchData?.overs || 0) * 6;
    const maxWickets = teamAPlayers.length - 1;

    // ── 1. Negative values check ───────────────────────────────────────────
    const allBatting = [
      ...teamAPlayers.map((p) => ({ name: p.playerName, data: battingDataA[p.Player_id] })),
      ...teamBPlayers.map((p) => ({ name: p.playerName, data: battingDataB[p.Player_id] })),
    ];
    const allBowling = [
      ...teamAPlayers.map((p) => ({ name: p.playerName, data: bowlingDataA[p.Player_id] })),
      ...teamBPlayers.map((p) => ({ name: p.playerName, data: bowlingDataB[p.Player_id] })),
    ];

    for (const { name, data } of allBatting) {
      if (!data) continue;
      if (
        Number(data.runs) < 0 ||
        Number(data.balls) < 0 ||
        Number(data.fours) < 0 ||
        Number(data.sixes) < 0
      ) {
        alert(`${name}: Batting values cannot be negative`);
        return;
      }
    }

    for (const { name, data } of allBowling) {
      if (!data) continue;
      if (
        Number(data.overs) < 0 ||
        Number(data.runs_given) < 0 ||
        Number(data.wickets) < 0
      ) {
        alert(`${name}: Bowling values cannot be negative`);
        return;
      }
    }

    // ── 2. Total balls check ───────────────────────────────────────────────
    const teamATotalBalls = teamAPlayers.reduce((total, player) => {
      return total + Number(battingDataA[player.Player_id]?.balls || 0);
    }, 0);

    const teamBTotalBalls = teamBPlayers.reduce((total, player) => {
      return total + Number(battingDataB[player.Player_id]?.balls || 0);
    }, 0);

    if (teamATotalBalls > maxBalls) {
      alert(
        `${selectedMatchData?.team1_name} has played ${teamATotalBalls} balls but max allowed is ${maxBalls} (${selectedMatchData?.overs} overs)`
      );
      return;
    }

    if (teamBTotalBalls > maxBalls) {
      alert(
        `${selectedMatchData?.team2_name} has played ${teamBTotalBalls} balls but max allowed is ${maxBalls} (${selectedMatchData?.overs} overs)`
      );
      return;
    }

    // ── 3. Individual player balls check ──────────────────────────────────
    for (const player of teamAPlayers) {
      const balls = Number(battingDataA[player.Player_id]?.balls || 0);
      if (balls > maxBalls) {
        alert(`${player.playerName} cannot face more than ${maxBalls} balls`);
        return;
      }
    }

    for (const player of teamBPlayers) {
      const balls = Number(battingDataB[player.Player_id]?.balls || 0);
      if (balls > maxBalls) {
        alert(`${player.playerName} cannot face more than ${maxBalls} balls`);
        return;
      }
    }

    // ── 4. Fours & Sixes vs Runs check ────────────────────────────────────
    for (const player of teamAPlayers) {
      const data = battingDataA[player.Player_id];
      if (!data) continue;
      const boundaryRuns =
        Number(data.fours || 0) * 4 + Number(data.sixes || 0) * 6;
      if (boundaryRuns > Number(data.runs || 0)) {
        alert(
          `${player.playerName}: Boundary runs (${boundaryRuns}) cannot exceed total runs (${data.runs || 0})`
        );
        return;
      }
    }

    for (const player of teamBPlayers) {
      const data = battingDataB[player.Player_id];
      if (!data) continue;
      const boundaryRuns =
        Number(data.fours || 0) * 4 + Number(data.sixes || 0) * 6;
      if (boundaryRuns > Number(data.runs || 0)) {
        alert(
          `${player.playerName}: Boundary runs (${boundaryRuns}) cannot exceed total runs (${data.runs || 0})`
        );
        return;
      }
    }

    // ── 5. Wickets check ──────────────────────────────────────────────────
    const teamAWickets = Object.values(bowlingDataB).reduce((total, data) => {
      return total + Number(data.wickets || 0);
    }, 0);

    const teamBWickets = Object.values(bowlingDataA).reduce((total, data) => {
      return total + Number(data.wickets || 0);
    }, 0);

    if (teamAWickets > maxWickets) {
      alert(
        `${selectedMatchData?.team1_name} cannot lose more than ${maxWickets} wickets`
      );
      return;
    }

    if (teamBWickets > maxWickets) {
      alert(
        `${selectedMatchData?.team2_name} cannot lose more than ${maxWickets} wickets`
      );
      return;
    }

    // ── 6. Bowling overs check ────────────────────────────────────────────
    const teamABowlingOvers = teamAPlayers.reduce((total, player) => {
      return total + Number(bowlingDataA[player.Player_id]?.overs || 0);
    }, 0);

    const teamBBowlingOvers = teamBPlayers.reduce((total, player) => {
      return total + Number(bowlingDataB[player.Player_id]?.overs || 0);
    }, 0);

    if (teamABowlingOvers > selectedMatchData?.overs) {
      alert(
        `${selectedMatchData?.team1_name} bowling overs (${teamABowlingOvers}) exceed match overs (${selectedMatchData?.overs})`
      );
      return;
    }

    if (teamBBowlingOvers > selectedMatchData?.overs) {
      alert(
        `${selectedMatchData?.team2_name} bowling overs (${teamBBowlingOvers}) exceed match overs (${selectedMatchData?.overs})`
      );
      return;
    }

    // ── 7. Batting runs must equal opponent bowling runs ──────────────────
    if (teamARuns !== teamBBowlingRuns) {
      alert(
        `${selectedMatchData?.team1_name} batting runs (${teamARuns}) do not match ${selectedMatchData?.team2_name} bowling runs given (${teamBBowlingRuns})`
      );
      return;
    }

    if (teamBRuns !== teamABowlingRuns) {
      alert(
        `${selectedMatchData?.team2_name} batting runs (${teamBRuns}) do not match ${selectedMatchData?.team1_name} bowling runs given (${teamABowlingRuns})`
      );
      return;
    }

    // ── 8. Save to API ────────────────────────────────────────────────────
    try {
      const battingRecords = [
        ...Object.entries(battingDataA).map(([player_id, data]) => ({
          player_id,
          runs: data.runs || 0,
          balls: data.balls || 0,
          fours: data.fours || 0,
          sixes: data.sixes || 0,
        })),
        ...Object.entries(battingDataB).map(([player_id, data]) => ({
          player_id,
          runs: data.runs || 0,
          balls: data.balls || 0,
          fours: data.fours || 0,
          sixes: data.sixes || 0,
        })),
      ];

      const bowlingRecords = [
        ...Object.entries(bowlingDataA).map(([player_id, data]) => ({
          player_id,
          overs: data.overs || 0,
          runs_given: data.runs_given || 0,
          wickets: data.wickets || 0,
        })),
        ...Object.entries(bowlingDataB).map(([player_id, data]) => ({
          player_id,
          overs: data.overs || 0,
          runs_given: data.runs_given || 0,
          wickets: data.wickets || 0,
        })),
      ];

      if (battingRecords.length > 0) {
        await api.post("/SaveBatting", {
          matchId: selectedMatch,
          records: battingRecords,
        });
      }

      if (bowlingRecords.length > 0) {
        await api.post("/SaveBowling", {
          matchId: selectedMatch,
          records: bowlingRecords,
        });
      }

      const t1 = teamARuns;
      const t2 = teamBRuns;
      let winner;
      if (t1 > t2) {
        winner = selectedMatchData?.team1_name || "Team 1";
      } else if (t2 > t1) {
        winner = selectedMatchData?.team2_name || "Team 2";
      } else {
        winner = "Draw";
      }

      await api.post("/SaveMatchResult", {
        matchId: selectedMatch,
        team1_score: teamARuns,
        team2_score: teamBRuns,
        team1_wickets: team1Wickets,
        team2_wickets: team2Wickets,
        winner,
      });

      alert("Match Saved Successfully");
    } catch (err) {
      console.log(err);
      alert("Error Saving Match");
    }
  };

  return (
    <div className="control-container">
      <div className="control-card">
        <button className="A-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="icon-circle">🏏</div>
        <h1>Match Control</h1>

        <select
          className="match-select"
          value={selectedMatch}
          onChange={handleMatchChange}
        >
          <option value="">Select Match</option>
          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.team1_name} vs {match.team2_name}
            </option>
          ))}
        </select>

        {/* TEAM A BATTING */}
        <h2>{selectedMatchData?.team1_name || "Team A"} Batting</h2>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Runs</th>
              <th>Balls</th>
              <th>4s</th>
              <th>6s</th>
            </tr>
          </thead>
          <tbody>
            {teamAPlayers.map((player) => (
              <tr key={player.Player_id}>
                <td>{player.playerName}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBattingA(player.Player_id, "runs", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBattingA(player.Player_id, "balls", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBattingA(player.Player_id, "fours", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBattingA(player.Player_id, "sixes", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TEAM B BATTING */}
        <h2>{selectedMatchData?.team2_name || "Team B"} Batting</h2>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Runs</th>
              <th>Balls</th>
              <th>4s</th>
              <th>6s</th>
            </tr>
          </thead>
          <tbody>
            {teamBPlayers.map((player) => (
              <tr key={player.Player_id}>
                <td>{player.playerName}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBattingB(player.Player_id, "runs", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBattingB(player.Player_id, "balls", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBattingB(player.Player_id, "fours", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBattingB(player.Player_id, "sixes", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TEAM A BOWLING */}
        <h2>{selectedMatchData?.team1_name || "Team A"} Bowling</h2>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Overs</th>
              <th>Runs</th>
              <th>Wickets</th>
            </tr>
          </thead>
          <tbody>
            {teamAPlayers.map((player) => (
              <tr key={`a-bowl-${player.Player_id}`}>
                <td>{player.playerName}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBowlingA(player.Player_id, "overs", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBowlingA(
                        player.Player_id,
                        "runs_given",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBowlingA(
                        player.Player_id,
                        "wickets",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TEAM B BOWLING */}
        <h2>{selectedMatchData?.team2_name || "Team B"} Bowling</h2>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Overs</th>
              <th>Runs</th>
              <th>Wickets</th>
            </tr>
          </thead>
          <tbody>
            {teamBPlayers.map((player) => (
              <tr key={`b-bowl-${player.Player_id}`}>
                <td>{player.playerName}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBowlingB(player.Player_id, "overs", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBowlingB(
                        player.Player_id,
                        "runs_given",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={(e) =>
                      updateBowlingB(
                        player.Player_id,
                        "wickets",
                        e.target.value
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="score-summary">
          <h3>
            {selectedMatchData?.team1_name} Calculated Runs : {teamARuns}
          </h3>
          <h3>
            {selectedMatchData?.team2_name} Calculated Runs : {teamBRuns}
          </h3>
          <h4>
            {selectedMatchData?.team1_name} Bowling Runs Given :{" "}
            {teamABowlingRuns}
          </h4>
          <h4>
            {selectedMatchData?.team2_name} Bowling Runs Given :{" "}
            {teamBBowlingRuns}
          </h4>
        </div>

        <h2>Match Result</h2>
        <div className="result-grid">
          <input
            type="number"
            min="0"
            placeholder="Team 1 Score"
            value={teamARuns}
            readOnly
          />
          <input
            type="number"
            min="0"
            placeholder="Team 1 Wickets"
            value={team1Wickets}
            disabled
            onChange={(e) => setTeam1Wickets(e.target.value)}
          />
          <input
            type="number"
            min="0"
            placeholder="Team 2 Score"
            value={teamBRuns}
            readOnly
          />
          <input
            type="number"
            min="0"
            placeholder="Team 2 Wickets"
            value={team2Wickets}
            disabled
            onChange={(e) => setTeam2Wickets(e.target.value)}
          />
        </div>

        <button className="save-btn" onClick={saveMatch}>
          Save Match
        </button>
      </div>
    </div>
  );
}

export default Control;