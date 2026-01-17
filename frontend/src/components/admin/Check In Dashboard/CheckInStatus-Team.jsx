import React, { useEffect, useState, useRef } from 'react';
import styles from './CheckInStatus.module.css';

const CheckInStatus = () => {
  const [slotData, setSlotData] = useState({
    slot1: [
      { id: 1, name: 'Alice', team: 'Tech Titans' },
      { id: 2, name: 'Bob', team: 'Tech Titans' },
      { id: 3, name: 'Dinesh',team: 'Debuggers' },
    ],
    slot2: [
      { id: 4, name: 'Hari', team: 'Script Kiddies' },
      { id: 5, name: 'Vimal', team: 'Script Kiddies' },
    ],
  });

  const [searchTerm, setSearchTerm] = useState('');

  const slotRefs = useRef({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Refreshing slot data...');
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

const matchFilter = (part) =>
  part.id.toString().includes(searchTerm) ||
  part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (part.team && part.team.toLowerCase().includes(searchTerm.toLowerCase()));


  const renderRow = (part) => (
    <li
      key={part.id}
      className={searchTerm && matchFilter(part) ? styles.highlight : ''}
    >
      <span>{part.id}</span>
      <span>{part.name}</span>
      <span>{part.team}</span>
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
      <div className={styles.navbar}>
        <span className={styles.link}>Participants</span>
        <span className={styles.link}>Check-In Status</span>
      </div>

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

export default CheckInStatus;
