import React, { useEffect, useRef, useState } from "react";
import styles from "./event.module.css";
import cap from "../../assets/cap.png";
import iron from "../../assets/iron.png";
import spydi from "../../assets/spydi.png";

const data = [
  {
    date: "20 NOV 2025",
    title: "Technical Events",
    desc: "Explore cutting-edge technical challenges and competitions.",
    events: [
      { name: "AI Workshop"},
      { name: "Machine Learning Hackathon"},
      { name: "Web Development Challenge"},
      { name: "Cyber Security CTF" },
      { name: "Data Science Sprint" }
    ],
    color: "neonred",
    type: "tech",
    icon: iron,
  },
  {
    date: "28 DEC 2025",
    title: "Non-Technical Events",
    desc: "Fun, creative, and engaging non-technical events for everyone.",
    events: [
      { name: "Photography Contest"},
      { name: "Treasure Hunt" },
      { name: "Quiz"},
      { name: "Debate"},
      { name: "Short Film Contest"}
    ],
    color: "neonblue",
    type: "nontech",
    icon: cap,
  },
    {
    date: "Comming soon..",
    title: "Work Shop",
    desc: "Gain our knowlege and experience with our workshop.",
    events: [],
    color: "neonred",
    type: "workshop",
    icon: spydi,
  }
];

export default function Event({ setEventType }) {

  const wrapRef = useRef(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);

  // Toggle card expansion
  const toggleCard = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
      setExpandedEvent(null);
    } else {
      setExpandedCard(index);
    }
  };

  // Toggle individual event expansion
  const toggleEvent = (eventIndex, cardIndex) => {
    if (expandedEvent === `${cardIndex}-${eventIndex}`) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(`${cardIndex}-${eventIndex}`);
    }
  };

  // Handle event redirection
  const handleRedirect = (link) => {
    window.location.href = link;
  };

  // optional reveal-on-scroll for cards
  useEffect(() => {
    const opts = { threshold: 0.12 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add(styles.reveal);
      });
    }, opts);

    const items = wrapRef.current?.querySelectorAll(`.${styles.row}`);
    items?.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.page}>
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
                className={`${styles.card} ${expandedCard === i ? styles.cardExpanded : ''}`} 
                tabIndex={0}
                onClick={() => toggleCard(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleCard(i);
                  }
                }}
                role="button"
                aria-expanded={expandedCard === i}
              >
                <span className={`${styles.badge} ${styles[item.color]}`}>
                  {item.date}
                </span>

                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>

                {/* expand/collapse indicator */}
                {/* <div className={styles.expandIndicator}>
                  {expandedCard === i ? '▼' : '▶'} {expandedCard === i ? 'Hide Events' : 'View Events'}
                </div> */}

                {/* clickable event list - visible when card is expanded */}
                {expandedCard === i && (
                  <div className={styles.eventListContainer}>
                    <ul className={styles.eventList}>
                      {item.events.map((ev, idx) => (
                  <li
                    key={idx}
                    className={styles.eventItem}
                    onClick={() =>
                      setEventType({
                        category: item.type,
                        name: ev.name
                      })
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.eventHeader}>
                      <span className={styles.eventName}>{ev.name}</span>
                    </div>
                  </li>

                      ))}
                    </ul>
                  </div>
                )}
              </article>

              {/* connector + diamond marker */}
            </div>
          );
        })}
      </div>
    </section>
  );
}