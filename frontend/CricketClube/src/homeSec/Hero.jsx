import React from "react";
import "../userstyles/Hero.css";

function Hero() {

  return (

    <div className="hero-section">

      <div className="adminHeadline">

        {
          "THE ULTIMATE CRICKET APP"
          .split("")
          .map((letter, index) => (

            <span
              key={index}
              className="headlineLetter"
              style={{
                animationDelay: `${index * 0.08}s`,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>

          ))
        }

      </div>

      <h1 className="future-heading">
        WE BUILD YOUR FUTURE
      </h1>

    </div>
  );
}

export default Hero;