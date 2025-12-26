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

          {/* --- HANGING KEYCHAIN (SVG only, no external image) --- */}
          {/* hangAnchor contains the hole rim + dark aperture + keychain */}
          

          <ul className={styles.navList}>
            {/* <h1 className={styles.NavTitle}>COGNEBULA</h1> */}
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


//  <div className={styles.hangAnchor} aria-hidden="true">
//             <div className={styles.holeCenter} />   {/* dark aperture (hole) */}
//             <div className={styles.holeRim} />     {/* metal rim around hole */}
//             {/* SVG keychain: ring -> chain -> connector -> medallion (with center image) */}
//             <svg
//               className={styles.keychain}
//               viewBox="0 0 80 180"
//               role="img"
//               aria-label="Decorative keychain"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <defs>
//                 <linearGradient id="goldGrad" x1="0" x2="1" y1="0" y2="1">
//                   <stop offset="0%" stopColor="#4b3264" />
//                   <stop offset="50%" stopColor="#4b3264" />
//                   <stop offset="100%" stopColor="#4b3264" />
//                 </linearGradient>
//                 <radialGradient id="medalShade" cx="50%" cy="35%" r="65%">
//                   <stop offset="0%" stopColor="#4b3264" stopOpacity="0.55"/>
//                   <stop offset="40%" stopColor="#4b3264" stopOpacity="0.95"/>
//                   <stop offset="100%" stopColor="#4b3264" stopOpacity="0.95"/>
//                 </radialGradient>
//                 <filter id="chainShadow" x="-50%" y="-50%" width="200%" height="200%">
//                   <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.35"/>
//                 </filter>
//               </defs>

//               {/* top split ring (looks like the keyring) */}
//               <g transform="translate(40,12)">
//                 <circle cx="0" cy="0" r="10" fill="none" stroke="#4b3264" strokeWidth="3.5" />
//                 <circle cx="0" cy="0" r="6.5" fill="none" stroke="#4b3264" strokeWidth="1.2" />
//               </g>

//               {/* short chain links */}
//               <g transform="translate(40,28)" stroke="#4b3264" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#chainShadow)">
//                 <ellipse cx="0" cy="12" rx="5.5" ry="8" transform="rotate(-15)" />
//   <ellipse cx="0" cy="34" rx="5.5" ry="8" transform="rotate(10)" />
//   <rect x="-3" y="48" width="6" height="10" rx="1.5" fill="#4b3264" stroke="none" />
//               </g>

//               {/* connecting plate */}
//               <g transform="translate(40,86)">
//                 <rect x="-6" y="-2" width="12" height="12" rx="2" fill="#4b3264" />
//               </g>

//               {/* round medallion / disc (with center image clipped) */}
//               <g transform="translate(40,120)">
//                 <defs>
//                   <clipPath id="medalClip">
//                     <circle cx="0" cy="0" r="28" />
//                   </clipPath>
//                 </defs>

//                 {/* outer metal disc */}
//                 <circle
//                   cx="0"
//                   cy="0"
//                   r="36"
//                   fill="url(#medalShade)"
//                   stroke="#8f6bcf"
//                   strokeWidth="2.5"
//                 />

//                 {/* image inside center (place your file in public/keychain-center.png) */}
//                 <image
//                   href="/favicon.ico"
//                   x="-28"
//                   y="-28"
//                   width="56"
//                   height="56"
//                   clipPath="url(#medalClip)"
//                   preserveAspectRatio="xMidYMid slice"
//                 />

//                 {/* inner border ring */}
//                 <circle
//                   cx="0"
//                   cy="0"
//                   r="28"
//                   fill="none"
//                   stroke="#8f6bcf"
//                   strokeWidth="1.5"
//                 />

//                 {/* subtle engraved markings (keeps original decorative feel) */}
//                 {/* <g transform="scale(0.9)">
//                   <circle cx="0" cy="0" r="22" fill="none" stroke="#8a5b00" strokeWidth="1.1" />
//                   <circle cx="0" cy="0" r="10" fill="none" stroke="#8a5b00" strokeWidth="1" />
//                   {Array.from({ length: 8 }).map((_, i) => {
//                     const angle = (i * Math.PI * 2) / 8;
//                     const x1 = Math.cos(angle) * 10;
//                     const y1 = Math.sin(angle) * 10;
//                     const x2 = Math.cos(angle) * 22;
//                     const y2 = Math.sin(angle) * 22;
//                     return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8a5b00" strokeWidth="1" strokeLinecap="round" />;
//                   })}
//                 </g> */}

//                 {/* small center dot */}
//                 {/* <circle cx="0" cy="0" r="2.5" fill="#8a5b00" /> */}
//               </g>
//             </svg>
//           </div>