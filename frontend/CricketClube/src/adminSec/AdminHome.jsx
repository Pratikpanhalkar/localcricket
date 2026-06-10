import React from "react";
import "../adminstyles/AdminHome.css";

function AdminHome() {
    return (
        <>

        {/* HERO SECTION */}
        <div className="infoSec">
            <h1>Every Match Tells a Story. Discover It.</h1>
            <p>Analyze Every Match. Master Every Performance.</p>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="buts">
            <div className="butbx1"><p># Add Players</p></div>
            <div className="butbx1"><p># Create Team</p></div>
            <div className="butbx1"><p># Start Match</p></div>
            <div className="butbx1"><p># Analyze Scores</p></div>
        </div>

        {/* DOWN ICON */}
        <div className="iconBox">
            <i className="fa-solid fa-arrow-down downIcon"></i>
        </div>

        {/* HOW TO GET STARTED — WORKFLOW GUIDE */}
        <div className="container workflowSection">

            <h2 className="workflowTitle">How to get started</h2>
            <p className="workflowSubtitle">
                Follow these steps in order to set up a match and track scores end-to-end.
            </p>

            <div className="workflowSteps">

                <div className="workflowStep">
                    <div className="stepNumber">1</div>
                    <div className="stepContent">
                        <h3>Add Player</h3>
                        <p>Register all players into the system before creating any match.</p>
                    </div>
                </div>

                <div className="stepArrow">
                    <i className="fa-solid fa-arrow-down"></i>
                </div>

                <div className="workflowStep">
                    <div className="stepNumber">2</div>
                    <div className="stepContent">
                        <h3>Create Match</h3>
                        <p>Enter the two team names, number of overs, and match date to create the match.</p>
                    </div>
                </div>

                <div className="stepArrow">
                    <i className="fa-solid fa-arrow-down"></i>
                </div>

                <div className="workflowStep">
                    <div className="stepNumber">3</div>
                    <div className="stepContent">
                        <h3>Player Set-up</h3>
                        <p>Assign registered players by selecting teams, browsing the full player list, and reviewing each player’s profile and career summary before the match begins.
</p>
                    </div>
                </div>

                <div className="stepArrow">
                    <i className="fa-solid fa-arrow-down"></i>
                </div>

                <div className="workflowStep">
                    <div className="stepNumber">4</div>
                    <div className="stepContent">
                        <h3>Control Score</h3>
                        <p>Use the live scoring panel to update runs, wickets and extras ball-by-ball in real time.
</p>
                    </div>
                </div>

                <div className="stepArrow">
                    <i className="fa-solid fa-arrow-down"></i>
                </div>

                <div className="workflowStep">
                    <div className="stepNumber">5</div>
                    <div className="stepContent">
                        <h3>Match History</h3>
                        <p>After the match, view the complete scorecard and individual player performance for that match.</p>
                    </div>
                </div>

                <div className="stepArrow">
                    <i className="fa-solid fa-arrow-down"></i>
                </div>

                <div className="workflowStep">
                    <div className="stepNumber">6</div>
                    <div className="stepContent">
                        <h3>History</h3>
                        <p>Access the full archive of all past matches.</p>
                    </div>
                </div>

            </div>
        </div>

        {/* FEATURE SECTION */}
        <div className="container scoreSection">
            <div className="row align-items-center">
                <div className="col-12 col-lg-6 text-white">
                    <h1 className="scoreHeading">Advanced Cricket Analysis Platform</h1>
                    <p className="scoreText mt-4">
                        Analyze match performances with detailed statistics, player insights,
                        score tracking, and comprehensive historical records.
                    </p>
                    {/* <button className="btn btn-warning btn-lg fw-bold mt-4 px-4 py-2 exploreBtn">
                        Explore Now
                    </button> */}
                </div>
                <div className="col-12 col-lg-6 text-center">
                    <img
                        src="/cricket_wheel_img.png"
                        alt="Cricket score preview"
                        className="img-fluid scoreImg"
                    />
                </div>
            </div>
        </div>

        </>
    );
}

export default AdminHome;