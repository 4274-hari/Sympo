import React, { useEffect, useRef, useState } from "react";
import "./Comet.css";

const Comet = () => {
  const cometRef = useRef(null);
  const planetRef = useRef(null);

  const [impact, setImpact] = useState(false);

  useEffect(() => {
    const comet = cometRef.current;
    const planet = planetRef.current;
    if (!comet || !planet) return;

    const r = planet.getBoundingClientRect();

    comet.style.setProperty("--tx", `${r.left + r.width * 0.7}px`);
    comet.style.setProperty("--ty", `${r.top + r.height * 0.6}px`);

    // Trigger IMPACT exactly when comet arrives
    const hit = setTimeout(() => setImpact(true), 3000);
    return () => clearTimeout(hit);
  }, []);

  return (
    <div className="space">
      {/* COMET */}
      <img
        ref={cometRef}
        src="/Planet_image/comet_final.png"
        className="comet"
        alt="comet"
      />

      {/* PLANET ZONE */}
      <div ref={planetRef} className="planet-wrapper">
        {!impact && (
          <img
            src="/Planet_image/planet_bg_removed.png"
            className="planet"
            alt="planet"
          />
        )}

        {impact && (
          <>
            {/* BLINDING FLASH */}
            <div className="impact-flash" />

            {/* SHOCKWAVE */}
            <div className="shockwave" />

            {/* PARTICLES */}
            {Array.from({ length: 800 }).map((_, i) => (
              <span
                key={i}
                className="debris"
                style={{
                  "--a": `${Math.random() * 360}deg`,
                  "--d": `${600 + Math.random() * 5000}px`,
                  "--s": `${0.5 + Math.random()}`,
                  "--c": `${Math.random()}`
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Comet;
