import React, { useEffect, useState } from "react";
import api from "./api";import "./MatchAnalysis.css";

function MatchAnalysis() {

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");

  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {

    try {

      const res = await api.get("/GetMatches");

      setMatches(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const loadAnalysis = async (matchId) => {

    try {

      const res = await api.get(`/MatchAnalysis/${matchId}`);

      setAnalysis(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleMatchChange = (e) => {

    const id = e.target.value;

    setSelectedMatch(id);

    if (id) {
      loadAnalysis(id);
    }
  };

  return (
    <div className="match-analysis-container">

      <h1>Match Analysis</h1>

      <select
        value={selectedMatch}
        onChange={handleMatchChange}
        className="match-select"
      >
        <option value="">
          Select Match
        </option>

        {matches.map((match) => (
          <option
            key={match.id}
            value={match.id}
          >
            {match.team1_name} vs {match.team2_name}
          </option>
        ))}
      </select>

      {analysis && (

        <>

          <div className="match-info">

            <h2>
              {analysis.match.team1_name}
              {" vs "}
              {analysis.match.team2_name}
            </h2>

            <p>
              Winner :
              {" "}
              {analysis.result?.winner}
            </p>

          </div>

          {/* TEAM A BATTING */}

          <div className="analysis-card">

            <h2>
              {analysis.match.team1_name} Batting
            </h2>

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

                {analysis.batting
                  .filter(p => p.team_side === "A")
                  .map((player, index) => (

                    <tr key={index}>

                      <td>{player.playerName}</td>
                      <td>{player.runs}</td>
                      <td>{player.balls}</td>
                      <td>{player.fours}</td>
                      <td>{player.sixes}</td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

          {/* TEAM B BATTING */}

          <div className="analysis-card">

            <h2>
              {analysis.match.team2_name} Batting
            </h2>

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

                {analysis.batting
                  .filter(p => p.team_side === "B")
                  .map((player, index) => (

                    <tr key={index}>

                      <td>{player.playerName}</td>
                      <td>{player.runs}</td>
                      <td>{player.balls}</td>
                      <td>{player.fours}</td>
                      <td>{player.sixes}</td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

          {/* TEAM A BOWLING */}

          <div className="analysis-card">

            <h2>
              {analysis.match.team1_name} Bowling
            </h2>

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

                {analysis.bowling
                  .filter(p => p.team_side === "A")
                  .map((player, index) => (

                    <tr key={index}>

                      <td>{player.playerName}</td>
                      <td>{player.overs}</td>
                      <td>{player.runs_given}</td>
                      <td>{player.wickets}</td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

          {/* TEAM B BOWLING */}

          <div className="analysis-card">

            <h2>
              {analysis.match.team2_name} Bowling
            </h2>

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

                {analysis.bowling
                  .filter(p => p.team_side === "B")
                  .map((player, index) => (

                    <tr key={index}>

                      <td>{player.playerName}</td>
                      <td>{player.overs}</td>
                      <td>{player.runs_given}</td>
                      <td>{player.wickets}</td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        </>

      )}

    </div>
  );
}

export default MatchAnalysis;