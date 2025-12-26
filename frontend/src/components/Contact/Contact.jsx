import React from 'react';
import styles from './Contact.module.css';
import panther from '../../Assets/panther.png';
import alien from '../../Assets/alien.png';

const people = [
  {
    role: 'Co-ordinator',
    name: 'Sadik Ahmed',
    position: 'Lead Coordinator',
    call: '+880123456789',
    mail: 'sadik@example.com',
    img: alien,
    side: 'left'
  },
  {
    role: 'Co-co-ordinator',
    name: 'Jane Doe',
    position: 'Assistant Coordinator',
    call: '+880987654321',
    mail: 'jane@example.com',
    img: panther,
    side: 'right'
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
            className={`${styles.card} ${p.side === 'left' ? styles.left : styles.right}`}
          >
            <div className={styles.ambientGlow} />
            <div className={styles.peek} aria-hidden>
              <img src={p.img} alt={`${p.name} illustration`} />
            </div>

            <div className={styles.info}>
              <div className={styles.role}>{p.role}</div>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.position}>{p.position}</div>

              <div className={styles.contactRow}>
                <a className={styles.contactLink} href={`tel:${p.call}`}>{p.call}</a>
                <a className={styles.contactLink} href={`mailto:${p.mail}`}>{p.mail}</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
