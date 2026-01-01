import React from "react";
import styles from "./highlight.module.css";

const items = [
  {
    src: "/images/one.JPG",
  },
  {},
  {
    src: "/images/two.JPG",
  },
  {},
  {
    src: "/images/three.JPG"
  },
  {
    src: "/images/four.JPG"
  },
  {
    title: "WORKSHOP",
    caption: "DJANGO"
  },
  {
    src: "/images/five.JPG"
  }
];

export default function Highlight() {
  return (
    <section className={styles.wrapper} id="highlights">
      <h2 className={styles.title}>HIGHLIGHTS</h2>

      <div className={styles.grid}>
        {/* Banner image */}
        <div className={`${styles.card} ${styles.span2} ${styles.overlayCard} ${styles.first}`} tabIndex={0}>
          <div className={styles.ambientGlow} />
          <img src={items[0].src} className={styles.img} />
          <div className={styles.overlay}>
            <h3>{items[0].title}</h3>
            <p>{items[0].caption}</p>
          </div>
        </div>

        {/* 250+ */}
        <div className={`${styles.card} ${styles.statCard}`}>
          <div className={styles.ambientGlow} />
          <div className={styles.statBig}>650+</div>
          <div className={styles.statSmall}>PARTICIPANTS</div>
        </div>

        {/* Tall image */}
        <div className={`${styles.card} ${styles.tall} ${styles.overlayCard}`} tabIndex={0}>
          <div className={styles.ambientGlow} />
          <img src={items[2].src} className={styles.img} />
          <div className={styles.overlay}>
            <h3>{items[2].title}</h3>
            <p>{items[2].caption}</p>
          </div>
        </div>

        {/* 50+ */}
        <div className={`${styles.card} ${styles.workshopCard}`}>
          <div className={styles.ambientGlow} />
          <div className={styles.workshopTitle}>Worth 1 Lakh</div>
          <div className={styles.workshopSub}>Cash prizes</div>
        </div>

        {/* Center image */}
        <div className={`${styles.card} ${styles.overlayCard}`} tabIndex={0}>
          <div className={styles.ambientGlow} />
          <img src={items[4].src} className={styles.img} />
        </div>

        {/* Bottom wide */}
        <div className={`${styles.card} ${styles.span2} ${styles.overlayCard}`} tabIndex={0}>
          <div className={styles.ambientGlow} />
          <img src={items[5].src} className={styles.img} />
        </div>

        {/* Workshop */}
        

        {/* Bottom right */}
        {/* <div className={`${styles.card} ${styles.overlayCard}`} tabIndex={0}>
          <div className={styles.ambientGlow} />
          <img src={items[7].src} className={styles.img} />
        </div> */}
      </div>
    </section>
  );
}
