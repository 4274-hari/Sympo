import React, { useEffect, useState, useRef } from 'react';
import styles from './CheckInStatus.module.css';

const CheckInStatusTeam = ({ morningSessionParticipants, afternoonSessionParticipants }) => {
  const slotData = {
    slot1: morningSessionParticipants?.data ?? [],
    slot2: afternoonSessionParticipants?.data ?? [],
  };

  const [searchTerm, setSearchTerm] = useState('');

  const slotRefs = useRef({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Refreshing slot data...');
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

const matchFilter = (part) =>
  part.registration_id.toString().includes(searchTerm) ||
  part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (part.team_name ?? '').toLowerCase().includes(searchTerm.toLowerCase());


  const renderRow = (part) => (
    <li
      key={part.registration_id}
      className={searchTerm && matchFilter(part) ? styles.highlight : ''}
    >
      <span>{part.registration_id}</span>
      <span>{part.name}</span>
      <span>{part.team_name}</span>
    </li>
  );

  useEffect(() => {
    if (!searchTerm) return;

    for (let slotKey in slotRefs.current) {
      const el = slotRefs.current[slotKey]?.querySelector(`.${styles.highlight}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  }, [searchTerm]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Check-In Status</h2>

      <div className={styles.slotsContainer}>
        {Object.entries(slotData).map(([slotKey, participants]) => (
          <div
            className={styles.slotBox}
            key={slotKey}
            ref={(el) => (slotRefs.current[slotKey] = el)}
          >
            <h3>{slotKey.toUpperCase()}</h3>

            <div className={styles.tableHeader}>
              <span>ID</span>
              <span>Name</span>
              <span>Team</span>
            </div>

            <ul className={styles.list}>
              {(searchTerm ? participants.filter(matchFilter) : participants).map(renderRow)}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchBox}
        />
      </div>
    </div>
  );
};

export default CheckInStatusTeam;
