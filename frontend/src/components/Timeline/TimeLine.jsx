import React, { useEffect, useRef } from "react";
import styles from "./TimeLine.module.css";

const TECHNICAL_EVENTS = [
  { id: 1, type: "Technical", title: "Inter-College", date: "2025-03-12", desc: "24-hour full-stack coding challenge.", icon: "⚙️", status: "upcoming" },
  { id: 2, type: "Technical", title: "Hack Night", date: "2025-03-18", desc: "Late-night hacking session.", icon: "💻", status: "upcoming" },
  { id: 3, type: "Technical", title: "Cloud Infra Talk", date: "2025-03-15", desc: "Talk on energy-efficient infrastructure.", icon: "☁️", status: "upcoming" },
  { id: 4, type: "Technical", title: "Algorithm Arena", date: "2025-03-14", desc: "Competitive programming contest.", icon: "🧮", status: "upcoming" },
  { id: 5, type: "Technical", title: "DevOps Workshop", date: "2025-03-16", desc: "CI/CD pipelines and deployment.", icon: "🚀", status: "upcoming" },
  { id: 6, type: "Technical", title: "Cyber Security CTF", date: "2025-03-17", desc: "Capture The Flag competition.", icon: "🛡️", status: "upcoming" },
  { id: 7, type: "Technical", title: "ML Challenge", date: "2025-03-19", desc: "Machine learning model building.", icon: "🤖", status: "upcoming" },
  { id: 8, type: "Technical", title: "IoT Expo", date: "2025-03-20", desc: "Internet of Things projects showcase.", icon: "📡", status: "upcoming" },
];

const NON_TECHNICAL_EVENTS = [
  { id: 1, type: "Non-Tech", title: "Kala Vedika", date: "2025-03-13", desc: "Music, dance and open-mic performances.", icon: "🎭", status: "upcoming" },
  { id: 2, type: "Non-Tech", title: "Photography Walk", date: "2025-03-17", desc: "Campus photo walk and contest.", icon: "📷", status: "upcoming" },
  { id: 3, type: "Non-Tech", title: "Food Fest", date: "2025-03-19", desc: "Street food and stalls.", icon: "🍜", status: "upcoming" },
  { id: 4, type: "Non-Tech", title: "Treasure Hunt", date: "2025-03-14", desc: "Campus-wide treasure hunt game.", icon: "🗺️", status: "upcoming" },
  { id: 5, type: "Non-Tech", title: "Debate Competition", date: "2025-03-15", desc: "Inter-college debate championship.", icon: "🎤", status: "upcoming" },
  { id: 6, type: "Non-Tech", title: "Art Exhibition", date: "2025-03-16", desc: "Student art and craft display.", icon: "🖼️", status: "upcoming" },
  { id: 7, type: "Non-Tech", title: "Sports Day", date: "2025-03-18", desc: "Various sports competitions.", icon: "⚽", status: "upcoming" },
  { id: 8, type: "Non-Tech", title: "Drama Night", date: "2025-03-20", desc: "Theatre performances and plays.", icon: "🎬", status: "upcoming" },
];

// Function to handle details button click
const handleDetailsClick = (event) => {
  console.log("Viewing details for:", event.title);
  
  // Store event data in localStorage for the details page
  localStorage.setItem('selectedEvent', JSON.stringify(event));
  
  // Create a unique URL for each event
  const eventSlug = event.title.toLowerCase().replace(/\s+/g, '-');
  const eventType = event.type === "Non-Tech" ? "non-technical" : event.type.toLowerCase();
  
  // Redirect to event details page
  // You can customize this based on your routing setup
  window.location.href = `/event-details/${eventType}/${eventSlug}-${event.id}`;
  
  // If using React Router, you might use:
  // navigate(`/event-details/${eventType}/${event.id}`);
};

function OverallTimeline({ events, title, subtitle }) {
  const scrollRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const pausedRef = useRef(false);
  const pauseTimeoutRef = useRef(null);

  const pauseAutoTemporarily = (ms = 1500) => {
    pausedRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, ms);
  };

  const handleUserScroll = () => {
    pauseAutoTemporarily(1500);
  };

  const handleMouseEnter = () => { pausedRef.current = true; };
  const handleMouseLeave = () => { pauseAutoTemporarily(300); };
  const handleTouchStart = () => { pausedRef.current = true; };
  const handleTouchEnd = () => { pauseAutoTemporarily(600); };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleUserScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleUserScroll);
  }, []);

  return (
    <div className={styles.overallTimeline}>
      <div className={styles.overallHeader}>
        <h2 className={styles.overallTitle}>
          <span className={styles.titleText}>{title}</span>
          <span className={styles.titleSub}>{subtitle}</span>
        </h2>
        <div className={styles.overallStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>9 Am</span>
            <span className={styles.statLabel}>Start</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>4 Pm</span>
            <span className={styles.statLabel}>End</span>
          </div>
        </div>
      </div>

      <div className={styles.timelineVisual}>
        <div
          className={styles.timelineScroll}
          ref={scrollRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {events.map((event, index) => (
            <div 
              key={`${event.id}-${index}`} 
              className={styles.timelineItem} 
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className={styles.dotContent}>
                <div className={styles.dotIcon}>{event.icon}</div>
                <div className={styles.dotInfo}>
                  <div className={styles.dotDate}>{event.date}</div>
                  <div className={styles.dotTitle}>{event.title}</div>
                  <div className={styles.dotDesc}>{event.desc}</div>
                  
                  {/* Details Button */}
                  <button 
                    className={styles.detailsButton}
                    onClick={() => handleDetailsClick(event)}
                    onMouseEnter={() => pausedRef.current = true}
                    onMouseLeave={() => pauseAutoTemporarily(300)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.timelineBar} />
      </div>
    </div>
  );
}

export default function SymposiumTimeline() {
  return (
    <div className={styles.page}>
      <div className={styles.backgroundElements}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.floatingShape}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              background: `radial-gradient(circle, ${i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#10b981" : "#f59e0b"}20, transparent 70%)`
            }}
          />
        ))}
      </div>

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>
            <span className={styles.titleMain}>Schedule</span>
            <span className={styles.titleSub}>Event Timeline & Schedule</span>
          </h1>
          <p className={styles.headerDesc}>
            Explore all upcoming events scheduled for the college symposium. Click "View Details" on any event to learn more and register.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <OverallTimeline 
          events={TECHNICAL_EVENTS} 
          title="Technical Events" 
          subtitle="Coding, hacking, and tech challenges"
        />
        
        <OverallTimeline 
          events={NON_TECHNICAL_EVENTS} 
          title="Non-Technical Events" 
          subtitle="Cultural, arts, sports, and fun activities"
        />
      </main>
    </div>
  );
}