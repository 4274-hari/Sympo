import React, { useEffect, useRef, useState } from "react";
import styles from "./clock.module.css";

const INITIAL_TIME = 38 * 24 * 60 * 60;

const formatCountdown = (totalSeconds) => {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
};

function FlipUnit({ label, value, previous, onFlipEnd }) {
  const shouldFlip = value !== previous;
  const displayValue = shouldFlip ? previous : value;

  return (
    <div className={styles.panel}>
      <span className={styles.label}>{label}</span>

      <div
        className={`${styles.flipCard} ${
          shouldFlip ? styles.flipping : ""
        }`}
      >
        {/* STATIC (FROZEN VALUE) */}
        <div className={styles.top}>
          <span>{displayValue}</span>
        </div>

        <div className={styles.bottom}>
          <span>{displayValue}</span>
        </div>

        {/* FLIP LAYERS */}
        {shouldFlip && (
          <>
            <div className={styles.topFlip}>
              <span>{previous}</span>
            </div>

            <div
              className={styles.bottomFlip}
              onAnimationEnd={onFlipEnd}
            >
              <span>{value}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function FlipClock() {
  // ✅ stable end time
  const endTimeRef = useRef(
    Date.now() + INITIAL_TIME * 1000
  );

  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(
      0,
      Math.floor((endTimeRef.current - Date.now()) / 1000)
    )
  );

  const time = formatCountdown(secondsLeft);
  const [prev, setPrev] = useState(time);

  // ✅ real-time tick (no drift)
  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((endTimeRef.current - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);
    };

    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`${styles.container} w-fit `}>
      <FlipUnit
        label="DAYS"
        value={time.days}
        previous={prev.days}
        onFlipEnd={() =>
          setPrev((p) => ({ ...p, days: time.days }))
        }
      />

      <FlipUnit
        label="HOURS"
        value={time.hours}
        previous={prev.hours}
        onFlipEnd={() =>
          setPrev((p) => ({ ...p, hours: time.hours }))
        }
      />

      <FlipUnit
        label="SEC"
        value={time.seconds}
        previous={prev.seconds}
        onFlipEnd={() =>
          setPrev((p) => ({ ...p, seconds: time.seconds }))
        }
      />
    </div>
  );
}