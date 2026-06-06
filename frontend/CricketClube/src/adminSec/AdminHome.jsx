import React from "react";
import "../adminstyles/AdminHome.css";

function AdminHome() {

    return (
        <>

        <div className="adminHeadline">
  {"STUPS".split("").map((letter, index) => (
    <span
      key={index}
      style={{ animationDelay: `${index * 0.3}s` }}
    >
      {letter}
    </span>
  ))}
</div>
        

        <div className="buts">

            <div className="butbx1">
                <p># Create Team</p>
            </div>

            <div className="butbx1">
                <p># Add players</p>
            </div>

            <div className="butbx1">
                <p># Start Match</p>
            </div>

            <div className="butbx1">
                <p># Analyze Scores</p>
            </div>

        </div>

        {/* INFO SECTION */}

        <div className="infoSec">
            <h1>
                Every Match Tells a Story. Discover It.
            </h1>

            <p>
                Analyze Every Match. Master Every Performance.
            </p>
        </div>

        {/* DOWN ICON */}

        <div className="iconBox">
            <i className="fa-solid fa-arrow-down downIcon"></i>
        </div>

        {/* FIRST SECTION */}

        <div className="container scoreSection">

            <div className="row align-items-center">

                <div className="col-12 col-lg-6 text-white">

                    <h1 className="scoreHeading">
                        Advanced Cricket Analysis Platform
                    </h1>

                    <p className="scoreText mt-4">
                        Analyze match performances with detailed statistics, player insights, score tracking, and comprehensive historical records.
                    </p>

                    <button className="btn btn-warning btn-lg fw-bold mt-4 px-4 py-2 exploreBtn">
                        Explore Now
                    </button>

                </div>

                <div className="col-12 col-lg-6 text-center">

                    <img
                        src="/cricket_wheel_img.png"
                        alt="score preview"
                        className="img-fluid scoreImg"
                    />

                </div>

            </div>

        </div>

        {/* SECOND SECTION */}

        <div className="container scoreSection">

            <div className="row align-items-center flex-column-reverse flex-lg-row">

                <div className="col-12 col-lg-6 text-center">

                    <img
                        src="/cricket_wheel_2_img.png"
                        alt="score preview"
                        className="img-fluid scoreImg"
                    />

                </div>

                <div className="col-12 col-lg-6 text-white">

                    <h1 className="scoreHeading">
                        Data-Driven Cricket Insights
                    </h1>

                    <p className="scoreText mt-4">
                        Turn match data into meaningful insights through performance analysis, statistical reports, player records, and match history visualization.
                    </p>

                    <button className="btn btn-warning btn-lg fw-bold mt-4 px-4 py-2 exploreBtn">
                        Explore Now
                    </button>

                </div>

            </div>

        </div>

        </>
    );
}

export default AdminHome;