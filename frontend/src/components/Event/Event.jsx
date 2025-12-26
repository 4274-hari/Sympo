import React, { useEffect, useRef, useState } from "react";
import styles from "./event.module.css";
import { useNavigate } from "react-router-dom";
import eventsData from "./eventlist.json";
// import StormbreakerCinematic  from "./StormbreakerCinematic.jsx";


const CATEGORY_META_KEYS = ["color", "icon", "date", "description", "id","img"];

const buildTimelineData = (eventsData) =>
  Object.entries(eventsData).map(([type, category]) => {
    const { color, icon, img, date, description } = category;

const events = Object.entries(category)
  .filter(([key]) => !CATEGORY_META_KEYS.includes(key))
  .map(([key, ev]) => ({
    key,      // 🔥 DOthethink
    ...ev
  }));

// console.log(eventsData);  
    return {
      type,
      title:
        type === "tech"
          ? "Technical Events"
          : type === "nontech"
          ? "Non-Technical Events"
          : "Work Shop",
      date: date || events[0]?.date || "Coming Soon",
      desc:
        description ||
        "Explore cutting-edge events and exciting challenges.",
      color,
      icon,
      img,
      events
    };
  });

export default function Event() {
  const wrapRef = useRef(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();
const handleCardClick = (item, index) => {
  if (item.type === "workshop") {
    const firstWorkshopEvent = item.events?.[0];

    if (firstWorkshopEvent?.key) {
      navigate(`/event/workshop/${firstWorkshopEvent.key}`);
    }
    return;
  }

  toggleCard(index);
  navigate(`/events/${item.type}`);
};



  const data = buildTimelineData(eventsData);

  const toggleCard = (index) =>
    setExpandedCard(expandedCard === index ? null : index);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add(styles.reveal)
        ),
      { threshold: 0.12 }
    );

    wrapRef.current
      ?.querySelectorAll(`.${styles.row}`)
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.page} id="events">
      {/* <StormbreakerCinematic />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a1f] via-[#301934] to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#4B0082]/20 via-transparent to-[#663399]/10" /> */}
      <header className={styles.header}>
        <h1 className={styles.title}>OUR EVENTS</h1>
        <div className={styles.underline} />
        <p className={styles.subtitle}>// These are our events</p>
      </header>

      <div className={styles.timelineWrap} ref={wrapRef}>
        <div className={styles.centerLine} />

        {data.map((item, i) => {
          const side = i % 2 === 0 ? styles.left : styles.right;
          const markerClass =
            item.color === "neonred"
              ? styles.red
              : item.color === "neonblue"
              ? styles.magenta
              : item.color === "neonspyred"
              ? styles.spyred
              : styles.purple;

          return (
            <div key={i} className={`${styles.row} ${side}`}>
              {/* floating image for this row */}
                <div
                  className={`${styles.floatImg} ${
                    item.type === "tech"
                      ? styles.techImg
                      : item.type === "nontech"
                      ? styles.nonTechImg
                      : styles.workshopImg
                  }`}
                  aria-hidden="true"
                >

                <img src={item.icon} alt={`${item.title} icon`} />
              </div>

              {/* card */}
<article
  className={`${styles.card} ${
    expandedCard === i ? styles.cardExpanded : ""
  } ${styles.cardGlow}`}
  tabIndex={0}
  role="button"
  aria-expanded={expandedCard === i}
  aria-label={`${expandedCard === i ? "Collapse" : "Expand"} ${item.title}`}
  data-expanded={expandedCard === i}
  onClick={() => handleCardClick(item, i)}
>

  {/* Gradient background overlay */}
  <div className={styles.cardGradient}></div>
  
  {/* Glow effect */}
  <div className={styles.cardGlowEffect}></div>
  
  {/* Date badge with improved styling */}
  <span className={`${styles.badge} ${styles[item.color]} ${styles.badgeGlow}`}>
    <span className={styles.badgeText}>{item.date || "07/02/2026"}</span>
    <span className={styles.badgeDeco}></span>
  </span>
  
  {/* Image with overlay effect */}
<div className={styles.imageContainer}>
  <img src={item.img} alt={item.title} className={styles.cardimg} loading="lazy" />
  <div className={styles.imageOverlay}></div>
  <div className={styles.imageShine}></div>
  {/* optional outer ring */}
  <div className={styles.borderRing}></div>
</div>

  
  {/* Content */}
  <div className={styles.cardContent}>
    <h3 className={styles.cardTitle}>
      <span className={styles.titleText}>{item.title}</span>
      <span className={styles.titleUnderline}></span>
    </h3>
    
    <div className={styles.cardDescWrapper}>
      <p className={styles.cardDesc}>{item.desc}</p>

    </div>
    
  </div>
  
</article>

              
            </div>
          );
        })}
      </div>
    </section>
  );
}