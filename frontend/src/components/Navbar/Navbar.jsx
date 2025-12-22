// Navbar.jsx

import React, { useState } from "react";
import styles from "./navbar.module.css";

const navItems = [
  {
    key: "home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M3 10.5L12 4l9 6.5v7a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1v-7z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "about",
    label: "About",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "events",
    label: "Events",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M7 11h10v6H7zM7 5h2v2H7zM15 5h2v2h-2z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "schedules",
    label: "Schedules",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "contact",
    label: "Contact",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M21 8V7l-3 2-2-1-5 3-5-3-2 1-3-2v1l3 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10l3-2z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const [active, setActive] = useState("home");

  return (
    <header className={styles.wrapper} aria-label="Main navigation">
      <nav className={styles.nav}>
        {/* Dynamic Island container */}
        <div className={styles.dynamicIsland} role="navigation" aria-label="Primary">
          <ul className={styles.navList}>
            <h1 className={styles.NavTitle}>COGNEBULA</h1>
            {navItems.map((item) => (
              <li key={item.key} className={styles.navItem}>
                <button
                  className={`${styles.navButton} ${active === item.key ? styles.active : ""}`}
                  onClick={() => setActive(item.key)}
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


