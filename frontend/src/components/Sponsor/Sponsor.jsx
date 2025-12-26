// components/Sponsors/sponsor.jsx
import React from "react";
import styles from "./sponsor.module.css";

const sponsors = [
  { name: "Amazon", img: "/images/Sponsors/amazon.png" },
  { name: "Tesla", img: "/images/Sponsors/tesla.png" },
  { name: "Sony", img: "/images/Sponsors/sony.png" },
  { name: "Binance", img: "/images/Sponsors/red.png" },
  { name: "ASOS", img: "/images/Sponsors/red.png" },
  { name: "Crocs", img: "/images/Sponsors/crocs.png" },
  { name: "Medium", img: "/images/Sponsors/mahindra.png" },
  { name: "Unimed", img: "/images/Sponsors/adiddas.png" },
];

export default function Sponsor() {
  return (
    <section >
      <header className={styles.header}>
        <h1 className={styles.title}>OUR SPONSORS</h1>
        <div className={styles.underline} />
        <p className={styles.subtitle}>// These are our sponsors</p>
      </header>

      <div className={styles.wrapper}>
        {/* LEFT: Bubble with floating logos */}
        <div className={styles.bubbleContainer}>
          {sponsors.map((s, i) => (
            <div
              key={s.name}
              className={styles.floatingLogo}
              style={{ "--i": i }}
            >
              <img src={s.img} alt={s.name} />
            </div>
          ))}
        </div>

        {/* RIGHT: Message */}
        <div className={styles.messageContainer}>
          <div className={styles.glassBox}>
            <h2>Our Sponsors</h2>
            <p>
              We are deeply thankful to our sponsors for their continued support
              and belief in our vision. Their partnership makes this symposium
              possible and empowers innovation, collaboration, and shared growth.
            </p>
            <p className={styles.quote}>
              “Together, we build experiences that matter.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
