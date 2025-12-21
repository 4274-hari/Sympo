import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback } from "react";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0,
        },

        background: {
          color: { value: "transparent" },
        },

        fpsLimit: 60,

        particles: {
          number: {
            value: 120,
            density: {
              enable: true,
              area: 1200,
            },
          },

          color: {
            value: ["#ffffff", "#e9d5ff", "#c4b5fd"],
          },

          opacity: {
            value: { min: 0.2, max: 0.7 },
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.2,
              sync: false,
            },
          },

          size: {
            value: { min: 0.6, max: 2.2 },
          },

          blur: {
            enable: true,
            value: 2,
          },

          move: {
            enable: true,
            speed: 0.35,
            direction: "none",
            random: false,
            straight: false,

            // 🔥 THIS IS THE MAGIC
            noise: {
              enable: true,
              delay: {
                value: 5,
              },
            },

            outModes: {
              default: "out",
            },
          },
        },

        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;