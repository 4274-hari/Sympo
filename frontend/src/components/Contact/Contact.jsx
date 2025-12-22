/* ========================= Contact.jsx ========================= */
import React, { useRef } from "react";
import styles from "./Contact.module.css";
import bgvideo from "../../Assets/homepagesbg.mp4";


/**
 * Static Contact page for SYMPO event.
 * - All containers use box-shadow: var(--soft-shadow)
 * - Glass morphism (backdrop blur) panels
 * - Black primary text, purple accents
 * - Mobile-first, responsive
 *
 * NOTE: This version adds a full-viewport background video that loads
 * from the public folder. Put your video file at: /background.mp4
 * (or change the <source> src to match your filename). A poster image
 * /background-poster.jpg is optional and recommended for slow networks.
 */
export default function Contact() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const topicRef = useRef(null);
  const detailsRef = useRef(null);

  function onSubmitQuery(e) {
    e.preventDefault();
    const name = (nameRef.current?.value || "").trim();
    const email = (emailRef.current?.value || "").trim();
    const topic = (topicRef.current?.value || "").trim() || "General";
    const details = (detailsRef.current?.value || "").trim();

    const subject = encodeURIComponent(`SYMPO Query — ${topic}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${details}`);

    window.location.href = `mailto:sympo-queries@college.edu?subject=${subject}&body=${body}`;
  }

  // Try to load a local `profile.png` at runtime; if it's missing use a tiny inline SVG fallback
  let avatarSrc;
  try {
    // require inside try/catch prevents bundler failing when file is missing
    // If you're using a non-webpack bundler, replace with an appropriate import or ensure profile.png exists.
    // eslint-disable-next-line no-undef
    avatarSrc = require("./profile.png");
  } catch (err) {
    // fallback: small purple circle SVG data URL (transparent background)
    avatarSrc =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><rect width='100%' height='100%' fill='transparent'/><circle cx='256' cy='220' r='180' fill='%236f2bd6'/></svg>`
      );
  }

  // Team members (three cards)
  const team = [
    { name: "Javi A. Torres", handle: "@javicodes", role: "Software Engineer", email: "javicodes@example.com" },
    { name: "Ava R. Moreno", handle: "@avadev", role: "Frontend Lead", email: "avadev@example.com" },
    { name: "Samir K. Patel", handle: "@samircode", role: "UI/UX Engineer", email: "samircode@example.com" },
  ];

  return (
    <div className={styles.page}>
      {/* Background video - placed before the main content so it's visually behind */}
      <div className={styles.bgContainer} aria-hidden>
        {/*
          Put your video file in the public folder as `/background.mp4`.
          If you have another name, change the `src` below (for example `/hero-loop.mp4`).
          Keep the video `muted` and `playsInline` to allow autoplay on mobile.
        */}
<video autoPlay muted loop playsInline className={styles.bgVideo}>
  <source src={bgvideo} type="video/mp4" />
</video>


        {/* subtle dark overlay so text reads better on top of bright videos */}
        <div className={styles.videoOverlay} />
      </div>

      <main className={styles.wrapper}>
        {/* Top header row: logo left — contact button right */}
        <div className={styles.topRow}>
          <div className={styles.logo} aria-hidden>
            {/* <span className={styles.logoPurple}></span> */}
            <span className={styles.logoBlack}>SYMPO</span>
          </div>

          {/* <a className={styles.Navcontact} href="#contact" aria-label="Go to contact section">
            Contact
          </a> */}
        </div>

        {/* Primary header */}
        <header className={`${styles.card} ${styles.header}`}>
          <div>
            <h1 className={styles.title}><span className={styles.titleAccent}>CONTACT</span></h1>
            {/* <p className={styles.subtitle}>Coordinators · Faculty · Queries · Social</p> */}
          </div>
          {/* <div className={styles.headerBadge}>DEC • 2025</div> */}

          <section className={`${styles.card} ${styles.sectionCard}`} aria-labelledby="social-title">
            {/* <h2 id="social-title" className={styles.sectionTitle}>Social</h2> */}
            <div className={styles.socialRow}>
              <a className={styles.socialBtn} href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6a4 4 0 100 8 4 4 0 000-8zm5-.5a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg>
              </a>
              <a className={styles.socialBtn} href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 5.92a7.16 7.16 0 01-2.06.56 3.6 3.6 0 001.57-1.98 7.18 7.18 0 01-2.28.87 3.59 3.59 0 00-6.12 3.27 10.18 10.18 0 01-7.39-3.74 3.6 3.6 0 001.11 4.79A3.53 3.53 0 012 9.9v.05a3.59 3.59 0 002.88 3.52c-.49.13-1 .2-1.5.08.43 1.34 1.68 2.31 3.17 2.33A7.2 7.2 0 012 18.57a10.16 10.16 0 005.5 1.61c6.6 0 10.21-5.53 10.21-10.32v-.47A7.24 7.24 0 0022 5.92z"/></svg>
              </a>
              <a className={styles.socialBtn} href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5a2.5 2.5 0 11-.02 0zM3 8.98h4v12H3zM9 8.98h3.78v1.65h.05c.53-1 1.82-2.06 3.75-2.06 4 0 4.75 2.63 4.75 6.05V21h-4v-5.05c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.92 1.3-1.92 2.64V21H9z"/></svg>
              </a>
            </div>
          </section>
        </header>

        {/* Content: left lists, right contact/form */}
        <section className={styles.grid}>
          {/* LEFT: Coordinators, Faculty, Social (REPLACED with Team cards as requested) */}
          <div className={styles.left}>
            <section className={`${styles.card} ${styles.sectionCard}`} aria-labelledby="team-title">
              <h2 id="team-title" className={styles.sectionTitle}>Cordinaters</h2>

              {/* The original Coordinators and Faculty sections (kept commented as requested)
              <section className={`${styles.card} ${styles.sectionCard}`} aria-labelledby="coordinators-title">
                <h2 id="coordinators-title" className={styles.sectionTitle}>Coordinators</h2>

                <div className={styles.person}>
                  <div>
                    <div className={styles.personName}>Anika Roy</div>
                    <div className={styles.personRole}>Head Coordinator</div>
                  </div>
                  <a className={styles.phone} href="tel:+919876543210">+91 98765 43210</a>
                </div>

                <div className={styles.person}>
                  <div>
                    <div className={styles.personName}>Rahul Mehta</div>
                    <div className={styles.personRole}>Logistics</div>
                  </div>
                  <a className={styles.phone} href="tel:+919123456789">+91 91234 56789</a>
                </div>

                <div className={styles.person}>
                  <div>
                    <div className={styles.personName}>Simran Kapoor</div>
                    <div className={styles.personRole}>Sponsorship</div>
                  </div>
                  <a className={styles.phone} href="tel:+919012345678">+91 90123 45678</a>
                </div>
              </section>

              <section className={`${styles.card} ${styles.sectionCard}`} aria-labelledby="faculty-title">
                <h2 id="faculty-title" className={styles.sectionTitle}>Faculty</h2>

                <div className={styles.person}>
                  <div>
                    <div className={styles.personName}>Dr. Priya Sen</div>
                    <div className={styles.personRole}>CSE</div>
                  </div>
                  <a className={styles.phone} href="tel:+919988766554">+91 99887 66554</a>
                </div>

                <div className={styles.person}>
                  <div>
                    <div className={styles.personName}>Prof. S K Nair</div>
                    <div className={styles.personRole}>ECE</div>
                  </div>
                  <a className={styles.phone} href="tel:+919771122334">+91 97711 22334</a>
                </div>

                <div className={styles.person}>
                  <div>
                    <div className={styles.personName}>Dr. M. Verma</div>
                    <div className={styles.personRole}>IT</div>
                  </div>
                  <a className={styles.phone} href="tel:+919666611111">+91 96666 11111</a>
                </div>
              </section>
              */}

              {/* NEW: three purple cards in a single line on desktop (stacks on mobile) */}
              <div className={styles.teamRow}>
                {team.map((member) => (
                  <article key={member.handle} className={styles.personCard}>
                    {/* <div className={styles.avatarWrap}>
                      <img src={avatarSrc} alt={`${member.name} avatar`} className={styles.personAvatar} />
                    </div> */}

                    <div className={styles.personInfo}>
                      <div className={styles.personName}>{member.name}</div>
                      <div className={styles.personRole}>{member.role}</div>
                      <div className={styles.personHandle}>{member.handle}</div>
                    </div>

                      <div className={styles.cardActions}>
                      <a className={styles.contactBtn} href="tel:+919999999999">Call</a>
                      <a className={styles.contactBtn} href="mailto:sympo-contact@college.edu">Email</a>
                      </div>
                  </article>
                ))}
              </div>
               
            </section>
          </div>

          {/* RIGHT: Contact + Query form */}
          <div className={styles.right}>
            <section id="contact" className={`${styles.card} ${styles.contactCard}`}>
              <div className={styles.contactHeader}>
                <h2 className={styles.contactTitle}><span className={styles.titleAccent}>Query Page</span> </h2>
                {/* <div className={styles.contactFlag}>FAST</div> */}
              </div>

              <p className={styles.contactText}>
                {/* For coordination, sponsorship, registration and urgent queries. Use quick actions or submit a query — routed to the team. */}
              </p>

              <div className={styles.actions}>
                {/* <a className={styles.btnPrimary} href="mailto:sympo-contact@college.edu">Email</a> */}
                {/* <a className={styles.btnNeutral} href="tel:+919999999999">Call</a> */}
                {/* <a className={styles.btnOutline} href="https://wa.me/919876543210?text=Hello%20Sympo" target="_blank" rel="noreferrer">WhatsApp</a> */}
              </div>

              <form className={styles.queryForm} onSubmit={onSubmitQuery} aria-label="Query form">
                <div className={styles.formRow}>
                  <input ref={nameRef} className={styles.input} type="text" placeholder="Your name" required />
                  <input ref={emailRef} className={styles.input} type="email" placeholder="Your email" required />
                </div>

                <input ref={topicRef} className={styles.input} type="text" placeholder="Topic (e.g. registration)" required />
                <textarea ref={detailsRef} className={styles.textarea} rows="5" placeholder="Explain your query" required />

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submit}>Send Query</button>
                  <button type="reset" className={styles.reset} onClick={() => { nameRef.current.value = ""; emailRef.current.value = ""; topicRef.current.value = ""; detailsRef.current.value = ""; }}>Reset</button>
                </div>
              </form>

              {/* <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Office</div>
                  <div className={styles.metaValue}>Room A-12, Main Building</div>
                </div>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Hours</div>
                  <div className={styles.metaValue}>Mon–Fri • 10:00–16:00</div>
                </div>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Emergency</div>
                  <a className={styles.metaLink} href="tel:+919999999999">+91 99999 99999</a>
                </div>
              </div> */}
            </section>

            {/* <section className={`${styles.card} ${styles.mapCard}`} aria-hidden>
              <div className={styles.mapBox}>VENUE LOCATION</div>
            </section> */}
          </div>
        </section>
      </main>
    </div>
  );
}

