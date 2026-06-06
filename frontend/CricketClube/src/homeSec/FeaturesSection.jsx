import React, {
  useCallback,
  useEffect,
  useRef
} from "react";

import Button from "@mui/material/Button";
import "../userstyles/FeaturesSection.css";

import {
  useInView,
  useMotionValue,
  useSpring
} from "framer-motion";

function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = ",",
  onStart,
  onEnd
}) {
  const ref = useRef(null);

  const motionValue = useMotionValue(
    direction === "down" ? to : from
  );

  const damping = 20 + 40 * (1 / duration);

  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness
  });

  const isInView = useInView(ref, {
    once: true,
    margin: "0px"
  });

  const getDecimalPlaces = (num) => {
    const str = num.toString();

    if (str.includes(".")) {
      const decimals = str.split(".")[1];

      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }

    return 0;
  };

  const maxDecimals = Math.max(
    getDecimalPlaces(from),
    getDecimalPlaces(to)
  );

  const formatValue = useCallback(
    (latest) => {
      const hasDecimals = maxDecimals > 0;

      const options = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals
          ? maxDecimals
          : 0,
        maximumFractionDigits: hasDecimals
          ? maxDecimals
          : 0
      };

      const formattedNumber = Intl.NumberFormat(
        "en-US",
        options
      ).format(latest);

      return separator
        ? formattedNumber.replace(/,/g, separator)
        : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(
        direction === "down" ? to : from
      );
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") onStart();

      const timeoutId = setTimeout(() => {
        motionValue.set(
          direction === "down" ? from : to
        );
      }, delay * 1000);

      const durationTimeoutId = setTimeout(() => {
        if (typeof onEnd === "function") onEnd();
      }, delay * 1000 + duration * 1000);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on(
      "change",
      (latest) => {
        if (ref.current) {
          ref.current.textContent =
            formatValue(latest);
        }
      }
    );

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}

// FEATURE SECTION

function FeaturesSection() {
  return (
    <>
      <div className="FeatureSectionPage">

        {/* CARDS SECTION */}

        <div className="container py-5">
          <div className="row g-4 justify-content-center">

            <div className="col-12 col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
              <div className="card">

                <img
                  src="slider1.png"
                  className="card-img-top"
                  alt="card"
                />

                <div className="card-body">
                  <p className="card-text">
                   Analyze batting and bowling performances, identify strengths, and track player growth across every match.
                  </p>
                </div>

              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
              <div className="card">

                <img
                  src="slider2.png"
                  className="card-img-top"
                  alt="card"
                />

                <div className="card-body">
                  <p className="card-text">
                    Transform scorecards into meaningful insights with detailed match statistics and performance breakdowns.
                  </p>
                </div>

              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
              <div className="card">

                <img
                  src="slider3.png"
                  className="card-img-top"
                  alt="card"
                />

                <div className="card-body">
                  <p className="card-text">
                    Compare team results, monitor trends, and evaluate performance through comprehensive match history.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div className="stats-header text-center mb-5">
  <h2 className="stats-title">
    Platform Performance at a Glance
  </h2>

  <p className="stats-subtitle">
    Track the growth of matches, teams, players, and tournaments managed through our cricket platform.
  </p>
</div>

        {/* COUNT SECTION */}

        <div className="container text-center py-5">
          <div className="row">

            <div className="col-6 col-md-3">
              <h1>
                <CountUp
                  from={0}
                  to={50}
                  separator=","
                  direction="up"
                  duration={2}
                  className="count-up-text"
                  delay={0}
                />
                +
              </h1>

              <p>Matches</p>
            </div>

            <div className="col-6 col-md-3">
              <h1>
                <CountUp
                  from={0}
                  to={15}
                  separator=","
                  direction="up"
                  duration={2}
                  className="count-up-text"
                  delay={0}
                />
                +
              </h1>

              <p>Teams</p>
            </div>

            <div className="col-6 col-md-3 mt-4 mt-md-0">
              <h1>
                <CountUp
                  from={0}
                  to={40}
                  separator=","
                  direction="up"
                  duration={3}
                  className="count-up-text"
                  delay={0}
                />
                +
              </h1>

              <p>Players</p>
            </div>

            <div className="col-6 col-md-3 mt-4 mt-md-0">
              <h1>
                <CountUp
                  from={0}
                  to={5}
                  separator=","
                  direction="up"
                  duration={2}
                  className="count-up-text"
                  delay={0}
                  
                />
                +
              </h1>

              <p>Tournaments</p>
            </div>

          </div>
        </div>

        {/* MAHI SECTION */}

        <div className="container py-5">
          <div className="row align-items-center">

            <div className="col-12 col-lg-6">

              <h3 className="text-muted custom-heading">
                Stay Calm. Read the Game. Make the Difference.
              </h3>

              <div className="d-flex justify-content-center mt-5">
                <Button variant="contained">
                  Search
                </Button>
              </div>

            </div>

            <div className="col-12 col-lg-6 text-center">
              <img
                className="mahi"
                src="/mahi1.png"
                alt="mahi"
              />
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default FeaturesSection;