import React, { useEffect, useState, useRef } from 'react';
import styles from './CheckInStatus.module.css';

const CheckInStatus = () => {
  const [slotData, setSlotData] = useState({
    slot1: [
      { id: 1, name: 'Alice', team: 'Team A' },
      { id: 2, name: 'Bob', team: 'Team B' },
      // add more to test scrolling
    ],
    slot2: [
      { id: 3, name: 'Charlie', team: 'Team C' },
      // add more to test scrolling
    ],
  });

  const [searchTerm, setSearchTerm] = useState('');

  const slot1Ref = useRef(null);
  const slot2Ref = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Refreshed slot data');
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const matchFilter = (part) =>
    part.id.toString().includes(searchTerm) ||
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (part.team && part.team.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredSlot1 = slotData.slot1.filter(matchFilter);
  const filteredSlot2 = slotData.slot2.filter(matchFilter);

  useEffect(() => {
    if (!searchTerm) return;

    const el1 = slot1Ref.current?.querySelector(`.${styles.highlight}`);
    const el2 = slot2Ref.current?.querySelector(`.${styles.highlight}`);

    if (el1) {
      el1.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (el2) {
      el2.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [searchTerm]);

  const renderRow = (part) => (
    <li
      key={part.id}
      className={searchTerm && matchFilter(part) ? styles.highlight : ''}
    >
      {part.id} — {part.name} {part.team && `(${part.team})`}
    </li>
  );

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <span className={styles.link}>Participants</span>
        <span className={styles.link}>Check-In Status</span>
      </div>

      <h2 className={styles.heading}>Check-In Status</h2>

      <input
        type="text"
        placeholder="Search by ID, name, or team..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchBox}
      />

      <div className={styles.slotsContainer}>
        <div className={styles.slotBox} ref={slot1Ref}>
          <h3>Slot 1</h3>
          <ul className={styles.list}>
            {(searchTerm ? filteredSlot1 : slotData.slot1).map(renderRow)}
          </ul>
        </div>

        {slotData.slot2.length > 0 && (
          <div className={styles.slotBox} ref={slot2Ref}>
            <h3>Slot 2</h3>
            <ul className={styles.list}>
              {(searchTerm ? filteredSlot2 : slotData.slot2).map(renderRow)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInStatus;
