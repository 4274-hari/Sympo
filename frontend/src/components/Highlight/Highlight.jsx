import React from "react";
import styles from "./highlight.module.css";

const items = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    title: "ORIENTATION",
    caption: "Nearly 500 students attended."
  },
  {},
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    title: "EVENT STANDY",
    caption: "Hacksprint Event Showcase."
  },
  {},
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "WORKSHOP",
    caption: "DJANGO"
  },
  {
    src: "data:image/jpeg;base64,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"
  }
];

export default function Highlight() {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>HIGHLIGHTS</h2>

      <div className={styles.grid}>
        {/* Banner image */}
        <div className={`${styles.card} ${styles.span2} ${styles.overlayCard}`} tabIndex={0}>
          <img src={items[0].src} className={styles.img} />
          <div className={styles.overlay}>
            <h3>{items[0].title}</h3>
            <p>{items[0].caption}</p>
          </div>
        </div>

        {/* 250+ */}
        <div className={`${styles.card} ${styles.statCard}`}>
          <div className={styles.statBig}>250+</div>
          <div className={styles.statSmall}>PARTICIPANTS</div>
        </div>

        {/* Tall image */}
        <div className={`${styles.card} ${styles.tall} ${styles.overlayCard}`} tabIndex={0}>
          <img src={items[2].src} className={styles.img} />
          <div className={styles.overlay}>
            <h3>{items[2].title}</h3>
            <p>{items[2].caption}</p>
          </div>
        </div>

        {/* 50+ */}
        <div className={`${styles.card} ${styles.statCard}`}>
          <div className={styles.statBig}>50+</div>
          <div className={styles.statSmall}>TEAMS</div>
        </div>

        {/* Center image */}
        <div className={`${styles.card} ${styles.overlayCard}`} tabIndex={0}>
          <img src={items[4].src} className={styles.img} />
        </div>

        {/* Bottom wide */}
        <div className={`${styles.card} ${styles.span2} ${styles.overlayCard}`} tabIndex={0}>
          <img src={items[5].src} className={styles.img} />
        </div>

        {/* Workshop */}
        <div className={`${styles.card} ${styles.workshopCard}`}>
          <div className={styles.workshopTitle}>WORKSHOP</div>
          <div className={styles.workshopSub}>DJANGO</div>
        </div>

        {/* Bottom right */}
        <div className={`${styles.card} ${styles.overlayCard}`} tabIndex={0}>
          <img src={items[7].src} className={styles.img} />
        </div>
      </div>
    </section>
  );
}
