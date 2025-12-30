// Navbar.jsx

import React, { useState } from "react";
import styles from "./navbar.module.css";
import { Activity, Calendar, CalendarClock, CalendarDays, CalendarHeart, Clock, Contact, Home, Layers, Mail, MapPin, PartyPopper, Sparkles, Star } from "lucide-react";

const navItems = [
  {
    key: "hero",
    label: "Home",
    icon: <Home />
  },
  
  {
    key: "events",
    label: "Events",
    icon: <Star />
  },
  {
    key: "schedules",
    label: "Schedules",
    icon: <Clock />
  },
  {
    key: "contact",
    label: "Contact",
    icon: <Contact />
  },
];

export default function Navbar() {
  const [active, setActive] = useState("home");

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if(element) {
      element.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  return (
    <header className={styles.wrapper} aria-label="Main navigation">
      <nav className={styles.nav}>
        {/* Dynamic Island container */}
        <div className={styles.dynamicIsland} role="navigation" aria-label="Primary">
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.key} className={styles.navItem}>
                <button
                  className={`${styles.navButton} ${active === item.key ? styles.active : ""}`}
                  onClick={() => {setActive(item.key); scrollToSection(item.key)}}
                  aria-current={active === item.key ? "page" : undefined}
                >
                  <span className={styles.icon} aria-hidden>
                    {item.icon}
                  </span>
                  <span className={styles.label}>{item.label}</span>
                </button>
              </li>
            ))}
              <div className={styles.registerWrap}>
              <a href="/register" className={styles.registerBtn}>
                Register
              </a>
            </div>
          </ul>
        </div>
      </nav>
    </header>
  );
}