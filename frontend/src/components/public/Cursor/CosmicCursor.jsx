import React, { useEffect, useRef } from "react";
import planetImg from "../../Assets/planet.png";
import "./CosmicCursor.css";

export default function CosmicCursor() {
  const planetRef = useRef(null);
  const trailRefs = useRef([]);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const trailLength = 20;
  const positions = useRef(
    Array(trailLength).fill({ x: mouse.current.x, y: mouse.current.y })
  );

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", move);

    const animate = () => {
      // Move planet
      planetRef.current.style.transform = `
        translate(${mouse.current.x}px, ${mouse.current.y}px)
        translate(-50%, -50%)
      `;

      // Update trail positions
      positions.current = [
        { x: mouse.current.x, y: mouse.current.y },
        ...positions.current.slice(0, -1),
      ];

      // Render comet beam
      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const pos = positions.current[i];

        el.style.transform = `
          translate(${pos.x}px, ${pos.y}px)
          translate(-50%, -50%)
        `;

        el.style.opacity = 1 - i / trailLength;
        el.style.scale = `${1 - i / trailLength}`;
      });

      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Planet Cursor */}
      <img
        ref={planetRef}
        src={planetImg}
        alt="planet cursor"
        className="planet-cursor"
      />

      {/* Comet Beam */}
      {positions.current.map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          className="comet-trail"
        />
      ))}
    </>
  );
}