import { Mail, Phone } from 'lucide-react';
import styles from './Contact.module.css';

export function Card({ contactGroups }) {
  return (
    <div className={styles.grid}>
      {contactGroups.map((group, idx) => (
        <article
          key={idx}
          className={`${styles.card} ${
            group.side === 'left'
              ? styles.left
              : group.side === 'right'
              ? styles.right
              : styles.center
          }`}
        >
          <div className={styles.ambientGlow} />

          {/* ✅ PEEK IMAGE */}
          {group.img && (
            <div className={styles.peek} aria-hidden>
              <img src={group.img} alt="" />
            </div>
          )}

          {group.title && (
            <h3 className={styles.groupTitle}>{group.title}</h3>
          )}

          <div className={styles.info}>
            {group.members.map((person, i) => (
              <div key={i} className={styles.personBlock}>
                <div
                  className={`${person.big ? "text-[1rem] md:text-[1.5rem]" : ""} ${styles.role}`}
                >
                  {person.role}
                </div>

                <div
                  className={`${person.big ? "text-[1rem] md:text-[1.5rem]" : ""} ${styles.name}`}
                >
                  {person.name}
                </div>

                <div className={styles.contactRow}>
                  {person.phone && (
                    <a className={styles.contactLink} href={`tel:${person.phone}`}>
                      <Phone />
                    </a>
                  )}
                  {person.email && (
                    <a className={styles.contactLink} href={`mailto:${person.email}`}>
                      <Mail />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}