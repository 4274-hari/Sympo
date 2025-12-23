import React from "react";
import styles from "./prize.module.css";

const prizes = [
  { title: "1st Prize", amount: "₹50,000", img: "/images/ipl.png" },
  { title: "2nd Prize", amount: "₹30,000", img: "/images/new.png" },
  { title: "3rd Prize", amount: "₹20,000", img: "/images/new1.png" },
];

export default function Prize() {
  return (
    <section className={styles.wrapper}>
      {/* -------- BACKGROUND EFFECTS -------- */}
      <div className={styles.background}>
        <div className={styles.stars} />
        <div className={styles.clouds} />
      </div>

      {/* -------- LEFT CONTENT -------- */}
      <div className={styles.messageContainer}>
        <div className={styles.glassBox}>
          <h2>Prizes & Rewards</h2>
          <p>
            Compete with the best minds and win exciting cash prizes and
            recognition. Innovation, creativity, and execution will be rewarded.
          </p>
        </div>
      </div>

      {/* -------- RIGHT ZIG-ZAG BUBBLES -------- */}
      <div className={styles.bubbleContainer}>
        {prizes.map((p, i) => (
          <div
            key={p.title}
            className={styles.prizeBubble}
            style={{
              "--i": i,
              "--dir": i % 2 === 0 ? 1 : -1, // 🔥 FIX
            }}
          >
            <img src={p.img} alt={p.title} />
            <h3>{p.title}</h3>
            <span>{p.amount}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
