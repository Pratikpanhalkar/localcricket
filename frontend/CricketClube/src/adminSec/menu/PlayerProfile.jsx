import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";
import "./Playerprofile.css";

function PlayerProfile() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [playerId]);

  const loadProfile = async () => {
    try {
      const res = await api.get(`/PlayerProfile/${playerId}`);
      setProfile(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pp-loading">Loading...</div>;
  if (!profile)  return <div className="pp-loading">Player not found.</div>;

  const { player, batting, bowling, matchHistory } = profile;

  // ── derived career totals ──────────────────────────────────────────────────
  const totalRuns    = batting.reduce((s, r) => s + r.runs,       0);
  const totalBalls   = batting.reduce((s, r) => s + r.balls,      0);
  const totalFours   = batting.reduce((s, r) => s + r.fours,      0);
  const totalSixes   = batting.reduce((s, r) => s + r.sixes,      0);
  const highScore    = batting.length ? Math.max(...batting.map(r => r.runs)) : 0;
  const strikeRate   = totalBalls > 0 ? ((totalRuns / totalBalls) * 100).toFixed(1) : "—";
  const battingAvg   = batting.length ? (totalRuns / batting.length).toFixed(1) : "—";

  const totalWickets = bowling.reduce((s, r) => s + r.wickets,    0);
  const totalRunsGiven = bowling.reduce((s, r) => s + r.runs_given, 0);
  const totalOvers   = bowling.reduce((s, r) => s + parseFloat(r.overs || 0), 0);
  const economy      = totalOvers > 0 ? (totalRunsGiven / totalOvers).toFixed(2) : "—";
  const bestBowling  = bowling.length
    ? bowling.reduce((best, r) =>
        r.wickets > best.wickets || (r.wickets === best.wickets && r.runs_given < best.runs_given)
          ? r : best
      , bowling[0])
    : null;

  const isCaptain = player.playerrole?.includes("-C");

  return (
    <div className="pp-container">

      {/* ── back button ── */}
      <button className="pp-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* ── player header ── */}
      <div className="pp-header">
        <div className="pp-avatar">
          {player.playerName.charAt(0).toUpperCase()}
        </div>
        <div className="pp-header-info">
          <h1>{player.playerName}</h1>
          <span className={`pp-role-badge ${isCaptain ? "captain" : ""}`}>
            {player.playerrole}
          </span>
        </div>
      </div>

      {/* ── career summary cards ── */}
      <h2 className="pp-section-title">Career Summary</h2>
      <div className="pp-stats-grid">

        <div className="pp-stat-card batting">
          <p className="pp-stat-label">Innings</p>
          <p className="pp-stat-value">{batting.length}</p>
        </div>
        <div className="pp-stat-card batting">
          <p className="pp-stat-label">Total Runs</p>
          <p className="pp-stat-value">{totalRuns}</p>
        </div>
        <div className="pp-stat-card batting">
          <p className="pp-stat-label">High Score</p>
          <p className="pp-stat-value">{highScore}</p>
        </div>
        <div className="pp-stat-card batting">
          <p className="pp-stat-label">Avg</p>
          <p className="pp-stat-value">{battingAvg}</p>
        </div>
        <div className="pp-stat-card batting">
          <p className="pp-stat-label">Strike Rate</p>
          <p className="pp-stat-value">{strikeRate}</p>
        </div>
        <div className="pp-stat-card batting">
          <p className="pp-stat-label">4s / 6s</p>
          <p className="pp-stat-value">{totalFours} / {totalSixes}</p>
        </div>

        <div className="pp-stat-card bowling">
          <p className="pp-stat-label">Wickets</p>
          <p className="pp-stat-value">{totalWickets}</p>
        </div>
        <div className="pp-stat-card bowling">
          <p className="pp-stat-label">Overs</p>
          <p className="pp-stat-value">{totalOvers.toFixed(1)}</p>
        </div>
        <div className="pp-stat-card bowling">
          <p className="pp-stat-label">Runs Given</p>
          <p className="pp-stat-value">{totalRunsGiven}</p>
        </div>
        <div className="pp-stat-card bowling">
          <p className="pp-stat-label">Economy</p>
          <p className="pp-stat-value">{economy}</p>
        </div>
        <div className="pp-stat-card bowling">
          <p className="pp-stat-label">Best Bowling</p>
          <p className="pp-stat-value">
            {bestBowling ? `${bestBowling.wickets}/${bestBowling.runs_given}` : "—"}
          </p>
        </div>
        <div className="pp-stat-card bowling">
          <p className="pp-stat-label">Matches</p>
          <p className="pp-stat-value">{matchHistory.length}</p>
        </div>

      </div>

      {/* ── match history ── */}
      <h2 className="pp-section-title">Match History</h2>
      {matchHistory.length === 0 ? (
        <p className="pp-empty">No matches played yet.</p>
      ) : (
        <div className="pp-history">
          {matchHistory.map((match, i) => {
            const bat = batting.find(b => b.match_id === match.match_id);
            const bowl = bowling.find(b => b.match_id === match.match_id);
            return (
              <div className="pp-match-card" key={i}>
                <div className="pp-match-header">
                  <span className="pp-match-name">{match.match_name}</span>
                  <span className="pp-match-date">
                    {match.match_date
                      ? new Date(match.match_date).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })
                      : ""}
                  </span>
                </div>
                <div className="pp-match-stats">
                  {bat && (
                    <div className="pp-match-stat-group">
                      <span className="pp-match-stat-label">Batting</span>
                      <span className="pp-match-stat-val">
                        {bat.runs} runs ({bat.balls} balls)
                        {bat.fours > 0 && ` · ${bat.fours}×4`}
                        {bat.sixes > 0 && ` · ${bat.sixes}×6`}
                      </span>
                    </div>
                  )}
                  {bowl && (
                    <div className="pp-match-stat-group">
                      <span className="pp-match-stat-label">Bowling</span>
                      <span className="pp-match-stat-val">
                        {bowl.wickets}/{bowl.runs_given} ({bowl.overs} ov)
                      </span>
                    </div>
                  )}
                  {!bat && !bowl && (
                    <span className="pp-match-stat-val" style={{ color: "#888" }}>
                      No score recorded
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default PlayerProfile;