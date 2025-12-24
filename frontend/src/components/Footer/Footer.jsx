import React from "react";
import styles from "./footer.module.css";
import { Instagram, Facebook, Mail, Chrome } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h3 className={styles.title}>COGNEBULA</h3>
          <p className={styles.paragraph}>
            Join us for a day of innovation, learning and networking. Hear from
            subject-matter experts, participate in workshops and collaborate with
            peers from across departments.
          </p>
          <div className={styles.socials}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.social}
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://accounts.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google"
              className={styles.social}
            >
              <Chrome size={20} />
            </a>

            <a
              href="mailto:info@college.edu"
              aria-label="Email"
              className={styles.social}
            >
              <Mail size={20} />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={styles.social}
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.columns}>
            <div className={styles.group}>
              <h4 className={styles.groupTitle}>Quick Links</h4>
              <ul className={styles.list}>
                <li><a href="#about">About</a></li>
                <li><a href="#committee">Committee</a></li>
                <li><a href="#schedule">Schedule</a></li>
                <li><a href="#sponsors">Sponsors</a></li>
              </ul>
            </div>

            <div className={styles.group}>
              <h4 className={styles.groupTitle}>Event Links</h4>
              <ul className={styles.list}>
                <li><a href="#paper">Paper Submission</a></li>
                <li><a href="#workshops">Workshops</a></li>
                <li><a href="#competitions">Competitions</a></li>
                <li><a href="#awards">Awards</a></li>
              </ul>
            </div>

            <div className={styles.group}>
              <h4 className={styles.groupTitle}>Co‑ordinators</h4>
              <div className={styles.coordList}>
                <div className={styles.coordItem}>
                  <div>
                    <div className={styles.coordName}>Dr. A. Kumar</div>
                    <div className={styles.coordRole}>Faculty Co‑ordinator</div>
                  </div>
                  <div className={styles.coordContact}>
                    <a href="tel:+911234567890">+91 12345 67890</a>
                    <a href="mailto:akumar@college.edu">akumar@college.edu</a>
                  </div>
                </div>

                {/* <div className={styles.coordItem}>
                  <div>
                    <div className={styles.coordName}>Ms. R. Singh</div>
                    <div className={styles.coordRole}>Student Co‑ordinator</div>
                  </div>
                  <div className={styles.coordContact}>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                    <a href="mailto:rsingh@college.edu">rsingh@college.edu</a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className={styles.registerWrap}>
            <a href="#register" className={styles.registerBtn}>Register Now</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>© {year} College Sympo. All rights reserved.</div>
    </footer>
  );
}


