import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import styles from "./categoryPage.module.css";
import eventsData from "./eventlist.json";
// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Keys that are NOT actual events
 */
const META_KEYS = ["color", "img", "date", "description", "id"];

const CATEGORY_TITLES = {
  tech: "TECHNICAL EVENTS",
  nontech: "NON-TECHNICAL EVENTS",
  workshop: "WORKSHOPS & SEMINARS"
};

const CATEGORY_ICONS = {
  tech: "🚀",
  nontech: "🎭",
  workshop: "⚡"
};

const Construction={
  // workshop: "Thambi onnaku oru adirchi,The Workshop is under construction"
}

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const bannerRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  const categoryData = eventsData[category];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

    // Animation on mount
  useEffect(() => {
    if (!bannerRef.current || !gridRef.current) return;

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      gsap.fromTo(
        bannerRef.current,
        { scale: 1, y: 0, opacity: 1 },
        {
          scale: 0.85,
          y: -120,
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top top",
            end: "bottom+=100 top",
            scrub: true,
            pin: true,
            pinSpacing: false,
          },
        }
      );
    }

    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [category]);



  // ❌ Invalid category
  if (!categoryData) {
    return (
      <motion.div 
        className={styles.error}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2>Category not found</h2>
      </motion.div>
    );
  }

  const {
    color,
    description = "Explore exciting events and challenges"
  } = categoryData;

  /**
   * ✅ Extract ONLY valid event objects
   */
  const events = Object.entries(categoryData)
    .filter(([key, value]) => !META_KEYS.includes(key) && typeof value === "object")
    .map(([key, value]) => ({ key, ...value }));

  // Card hover animations
  const handleCardHover = (index, isHovering) => {
    const card = cardsRef.current[index];
    if (!card) return;

    if (isHovering) {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(127, 0, 255, 0.3)",
        duration: 0.3
      });
    } else {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        duration: 0.3
      });
    }
  };

  return (
    <motion.section 
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* <Stromebreaker/> */}
      {/* ===== Parallax Banner ===== */}
      <motion.header
        ref={bannerRef}
        className={`${styles.banner} ${styles[color]}`}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          backgroundImage: `linear-gradient(
            rgba(11, 4, 16, 0.85),
            rgba(11, 4, 16, 0.95)
          ), url(${categoryData.img || "/default-banner.jpg"})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className={`${styles.overlay} w-full`}>
            <button 
              className={styles.backButton}
              onClick={() => navigate(-1)}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              ← BACK
            </button>
          <div className={styles.bannerContent}>
            
            <motion.div 
              className={styles.titleContainer}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className={styles.categoryIcon}>
                {CATEGORY_ICONS[category] || "📅"}
              </span>
              <h1 className={styles.title}>
                {CATEGORY_TITLES[category] || category.toUpperCase()}
              </h1>
              <div className={styles.categoryBadge}>
                {category.toUpperCase()}
              </div>
            </motion.div>

            <motion.p 
              className={styles.desc}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>
          </div>
        </div>
      </motion.header>

      {/* ===== Event Cards Grid ===== */}
      <div className={styles.container}>
        <div ref={gridRef} className={styles.grid}>
          {events.map((event, index) => (
            <motion.article
              key={event.id}
              ref={el => cardsRef.current[index] = el}
              className={`${styles.card} ${styles[color]}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover="hover"
              variants={{
                hover: { transition: { staggerChildren: 0.05 } }
              }}
              onMouseEnter={() => handleCardHover(index, true)}
              onMouseLeave={() => handleCardHover(index, false)}
              onClick={() => navigate(`/event/${category}/${event.key}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/event/${category}/${event.key}`);
                }
              }}
            >
              {/* Card Image with Gradient Overlay */}
              <div className={styles.cardImageContainer}>
                <img
                  src={event.sympoImg}
                  alt={event.title}
                  className={styles.cardImg}
                  loading="lazy"
                />
                <div className={styles.imageOverlay} />
                
                {/* Hurry Badge */}

              </div>

              {/* Card Content */}
              <motion.div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <motion.h3 
                    className={styles.cardTitle}
                    variants={{ hover: { color: "var(--accent-purple)" } }}
                  >
                    {event.title}
                  </motion.h3>
                  <motion.span 
                    className={styles.cardDate}
                    variants={{ hover: { x: 5 } }}
                  >
                    {event.date}
                  </motion.span>
                </div>

                <motion.p 
                  className={styles.cardDescription}
                  variants={{ hover: { opacity: 1 } }}
                >
                  {event.description}
                </motion.p>

                <div className={styles.cardFooter}>
                  <motion.div 
                    className={styles.eventId}
                    variants={{ hover: { opacity: 0.8 } }}
                  >
                    ID: {event.id || "N/A"}
                  </motion.div>
                  
                  <motion.button 
                    className={styles.exploreButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    EXPLORE →
                  </motion.button>
                </div>
              </motion.div>

              {/* Card Glow Effect */}
              <div className={styles.cardGlow} />
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}