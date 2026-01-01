import React from 'react';
import styles from './Contact.module.css';
import panther from '../../Assets/panther.png';
import alien from '../../Assets/alien.png';
import { Mail, Phone } from 'lucide-react';

const people = [
  {
    role: 'President',
    name: 'Aaron Ebinezer Arun A',
    position: 'President',
    call: '7358752876',
    mail: 'aaron@example.com',
    img: alien,
    side: 'left',
    showImage: true
  },
  {
    role: 'Co-ordinator',
    name: 'Niharika B',
    position: 'Vice-President',
    call: '8925469498',
    mail: 'niharika@example.com',
    img: panther,
    side: 'right',
    showImage: true   // 👈 center person, no image
  },
  {
    role: 'Co-ordinator',
    name: 'Mohamed Hajee J',
    position: 'Secretary',
    img: alien,
    call: '9094111907',
    mail: 'hajee@example.com',
    side: 'left',
    showImage: true   // 👈 center person, no image
  },
  {
    role: 'Co-co-ordinator',
    name: 'Pragati Sangari S R',
    position: 'Joint Secretary',
    call: '9600082752',
    mail: 'pragati@example.com',
    img: panther,
    side: 'right',
    showImage: true
  }
];

export default function ContactTeam() {
  return (
    <section className={styles.page} aria-label="Contact section" id='contact'>
      <div className={styles.headerWrap}>
        <h2 className={styles.title}>Contact</h2>
        <p className={styles.subtitle}>Reach out to our coordinators for any inquiries</p>
      </div>

      <div className={styles.grid}>
        {people.map((p, idx) => (
          <article
            key={idx}
            className={`${styles.card} ${
              p.side === 'left'
                ? styles.left
                : p.side === 'right'
                ? styles.right
                : styles.center
            }`}
          >
            <div className={styles.ambientGlow} />

            {p.showImage && (
              <div className={styles.peek} aria-hidden>
                <img src={p.img} alt={`${p.name} illustration`} />
              </div>
            )}

            <div className={styles.info}>
              <div className={styles.role}>{p.position}</div>
              <div className={styles.name}>{p.name}</div>
              {/* <div className={styles.position}>{p.position}</div> */}

              <div className={styles.contactRow}>
                <a className={styles.contactLink} href={`tel:${p.call}`}><Phone />{p.call}</a>
                <a className={styles.contactLink} href={`mailto:${p.mail}`}><Mail />{p.mail}</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
