import React from "react";
import styles from "./footer.module.css";
import { Instagram, Facebook, Mail, Linkedin, MessageCircle } from "lucide-react";
import logo from "../../../Assets/cognebula_logo.png"

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="footer">
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
              href="https://www.instagram.com/cognebula_2k26/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={styles.social}
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/cognebula-ai-ds/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Linkedin"
              className={styles.social}
            >
              <Linkedin size={20} />
            </a>

            <a
              href="mailto:cognebula@velammal.edu.in"
              aria-label="Email"
              className={styles.social}
            >
              <Mail size={20} />
            </a>

            <a
              href="https://chat.whatsapp.com/DZRuIPqd3X4JIW7WnoHwaX"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={styles.social}
            >
              {/* <MessageCircle size={20} /> */}
              <i class="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.columns}>
            <div className={styles.group}>
              <h4 className={styles.groupTitle}>Quick Links</h4>
              <ul className={styles.list}>
                <li><a href="#hero">Home</a></li>
                <li><a href="#events">Events</a></li>
                <li><a href="#schedules">Schedule</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className={styles.group}>
              <h4 className={styles.groupTitle}>Event Links</h4>
              <ul className={styles.list}>
                <li><a href="/events/tech">Technical</a></li>
                <li><a href="/events/nontech">Non Technical</a></li>
                <li><a href="#">Workshops</a></li>
              </ul>
            </div>

            <div className={styles.group}>
              {/* <h4 className={styles.groupTitle}>Faculty Co‑ordinators</h4>
              <div className={styles.coordList}>
                <div className={styles.coordItem}>
                  <div>
                    <div className={styles.coordName}>   Mrs. M. Priya</div>
                  </div>
                  <div className={styles.coordContact}>
                    <a href="tel:9841170770">+91 98411 70770</a>
                    <a href="mailto:priya@velammal.edu.in">priya@velammal.edu.in</a>
                  </div>
                </div>
                <div className={styles.coordItem}>
                  <div>
                    <div className={styles.coordName}>Mrs. S. Mythili</div>
                  </div>
                  <div className={styles.coordContact}>
                    <a href="tel:9626901493">+91 96269 01493</a>
                    <a href="mailto:mythili@velammal.edu.in">mythili@velammal.edu.in</a>
                  </div>
                </div>
              </div> */}
              <img src={logo} alt="Logo" className="w-34 hidden lg:block" />
            </div>
          </div>

          <div className={styles.registerWrap}>
            <a href="/register" className={styles.registerBtn}>Register Now</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>© {year} Cognebula'26. All rights reserved.</div>
    </footer>
  );
}
