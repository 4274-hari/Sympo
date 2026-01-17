import React from 'react';
import styles from './Contact.module.css';
import panther from '../../../Assets/panther.png';
import alien from '../../../Assets/alien.png';
import { Card } from './Card';

const contactGroups = [
  {
    title: "",
    img: panther,
    side: "right",
    members: [
      {
        role: "Staff Co-ordinator",
        name: "Mrs. Priya M",
        phone: "9841170770",
        email: "priya@vec.edu",
        big: true
      }
    ]
  },
  {
    title: "",
    img: alien,
    side: "left",
    members: [
      {
        role: "Staff Co-ordinator",
        name: "Mrs. S. Mythili",
        phone: "9626901493",
        email: "mythili@vec.edu",
        big: true
      }
    ]
  },
  {
    title: "President & Vice President",
    img: alien,
    side: "left",
    members: [
      {
        role: "President",
        name: "Aaron Ebinezer Arun A",
        phone: "7358752876",
        email: "aaaronebinezerarun@gmail.com"
      },
      {
        role: "Vice President",
        name: "Niharika B",
        phone: "8925469498",
        email: "niharikab200904@gmail.com"
      }
    ]
  },
  {
    title: "Secretary & Joint Secretary",
    img: panther,
    side: "right",
    members: [
      {
        role: "Secretary",
        name: "Mohamed Hajee J",
        phone: "9094111907",
        email: "mohammedhajee909@gmail.com"
      },
      {
        role: "Joint Secretary",
        name: "Pragati Sangari S R",
        phone: "9600082752",
        email: "pragatisangari@gmail.com"
      }
    ]
  }
];

export default function ContactTeam() {
  return (
    <section className={styles.page} aria-label="Contact section" id='contact'>
      <div className={styles.headerWrap}>
        <h2 className={styles.title}>Contact</h2>
        <p className={styles.subtitle}>Reach out to our coordinators for any Enquiries</p>
      </div>

      <Card contactGroups={contactGroups} />

    </section>
  );
}
