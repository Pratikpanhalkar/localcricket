import React, { useState } from "react";
import "./CreateTeam.css";
import api from "./api";

function CreateTeam() {

    const [teamName, setTeamName] = useState("");
    const [playerCount, setPlayerCount] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newteam = {
            TeamName: teamName,
            playerCount
        };


       try{
        const response = await api.post("/create_team", newteam);

       }catch(err){
            console.log(err);
       }

        alert(`${teamName} created successfully!`);

        setTeamName("");
        setPlayerCount("");
    };

    return (
        <div className="team">
            <div className="mainform">

                <div className="box">

                    <div className="team-header">

                        <div className="team-icon">
                            <i className="fa-solid fa-trophy"></i>
                        </div>

                        <h1>Create Cricket Match</h1>
                        <p>Add teams for the match</p>

                        <form onSubmit={handleSubmit}>

                            <input
                                type="text"
                                placeholder="Enter Team Name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Player Count"
                                value={playerCount}
                                onChange={(e) => setPlayerCount(e.target.value)}
                                required
                            />

                            <button type="submit">
                                Add Team
                            </button>

                        </form>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default CreateTeam;