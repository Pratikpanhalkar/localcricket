import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./Analysis.css";



function Analysis() {

    const [data, setData] = useState(null);
      const navigate = useNavigate(); 
    useEffect(() => {
        loadAnalysis();
    }, []);

    const loadAnalysis = async () => {

        try {

            const res = await api.get("/analysis");

            setData(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    if (!data) {
        return <h1 className="loading">Loading...</h1>;
    }

    return (
        <div className="analysis-container">
             <button className="A-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
            <h1 className="analysis-title">
                Cricket Analysis
            </h1>

            <p className="analysis-subtitle">
                Player Statistics & Match Performances
            </p>

            <Section
                title="Top Run Scorers"
                headers={["Player", "Runs"]}
                rows={data.topRuns.map(p => [
                    p.playerName,
                    p.total_runs
                ])}
            />

            <Section
                title="Most Wickets"
                headers={["Player", "Wickets"]}
                rows={data.topWickets.map(p => [
                    p.playerName,
                    p.total_wickets
                ])}
            />

            <Section
                title="Best Strike Rate"
                headers={["Player", "Strike Rate"]}
                rows={data.strikeRate.map(p => [
                    p.playerName,
                    p.strike_rate
                ])}
            />

            <Section
                title="Best Economy"
                headers={["Player", "Economy"]}
                rows={data.economy.map(p => [
                    p.playerName,
                    p.economy
                ])}
            />

            <Section
                title="Highest Individual Innings"
                headers={["Player", "Runs", "Balls", "Match"]}
                rows={data.topInnings.map(p => [
                    p.playerName,
                    p.runs,
                    p.balls,
                    p.match_name
                ])}
            />

            <Section
                title="Best Bowling Figures"
                headers={["Player", "Figures", "Match"]}
                rows={data.bestBowling.map(p => [
                    p.playerName,
                    `${p.wickets}/${p.runs_given}`,
                    p.match_name
                ])}
            />

        </div>
    );
}

function Section({ title, headers, rows }) {
    return (
        <div className="analysis-card">

            <h2>{title}</h2>

            <div className="table-wrapper">

                <table>

                    <thead>
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i}>{h}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i}>
                                {row.map((cell, j) => (
                                    <td key={j}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Analysis;