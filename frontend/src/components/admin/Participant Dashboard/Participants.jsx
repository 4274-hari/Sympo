import React, { useState, useEffect } from 'react';
import styles from './Participants.module.css';

const Participants = ({ participants }) => {
  const [isButtonEnabled, setButtonEnabled] = useState(false);
  const [buttonText, setButtonText] = useState('Send Certificates');
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [certificatesSent, setCertificatesSent] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [newParticipantId, setNewParticipantId] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  
  useEffect(() => {
    if (participants?.length) {
      setSelectedIds(participants.map(p => p.registration_id));
    }
  }, [participants]);

  const participantsPerPage = 20;

  useEffect(() => {
    const symposiumDate = new Date('2026-01-07T00:00:00');
    const now = new Date();
    if (now >= symposiumDate && !certificatesSent) {
      setButtonEnabled(true);
    }
  }, [certificatesSent]);

  const handleButtonClick = () => {
    if (!isButtonEnabled || certificatesSent) return;

    if (!showCheckboxes) {
      setShowCheckboxes(true);
      setButtonText('Send');
    } else {
      const confirmSend = window.confirm(
        `Send certificates to ${selectedIds.length} participants?`
      );

      if (confirmSend) {
        fetch('http://localhost:5000/api/send_certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds })
        })
          .then(res => res.json())
          .then(() => {
            setCertificatesSent(true);
            setButtonEnabled(false);
            setShowCheckboxes(false);
            setButtonText('Send Certificates');
          });
      }
    }
  };

  const handleNewParticipantSubmit = () => {
    if (!newParticipantId) return;

    fetch('http://localhost:5000/api/add_participant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participantId: newParticipantId })
    })
      .then(res => res.json())
      .then(() => {
        alert('Participant Added');
        setShowModal(false);
        setNewParticipantId('');
      });
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const filteredParticipants = participants.filter(part =>
    part.registration_id.toString().includes(searchTerm) ||
    part.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dataToDisplay = searchTerm ? filteredParticipants : participants;

  const indexOfLast = currentPage * participantsPerPage;
  const indexOfFirst = indexOfLast - participantsPerPage;
  const currentParticipants = dataToDisplay.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(dataToDisplay.length / participantsPerPage);

  return (
    <div className={styles.container}>
      {/* 🔥 Blur only background */}
      <div className={showModal ? styles.blurBackground : ''}>
        <h2 className={styles.heading}>Participants</h2>

        <div className={styles.topBar}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchBox}
          />

          <div className={styles.buttonGroup}>
            <button onClick={handleButtonClick} disabled={!isButtonEnabled || certificatesSent} className={styles.button}>
              {buttonText}
            </button>

            <button className={`${styles.newParticipantBtn} ${styles.button}`} onClick={() => setShowModal(true)}>
              New Participant
            </button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              {showCheckboxes && <th>Select</th>}
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>College</th>
              <th>Year</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            {currentParticipants.map(part => (
              <tr key={part.registration_id}>
                {showCheckboxes && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(part.registration_id)}
                      onChange={() => toggleSelection(part.registration_id)}
                    />
                  </td>
                )}
                <td>{part.registration_id}</td>
                <td>{part.name}</td>
                <td>{part.mobile}</td>
                <td>{part.email}</td>
                <td>{part.college}</td>
                <td>{part.year}</td>
                <td>{part.session}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!searchTerm && totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Add Participant</h3>

            <input
              type="text"
              placeholder="Participant ID"
              value={newParticipantId}
              onChange={(e) => setNewParticipantId(e.target.value)}
            />

            <div className={styles.modalButtons}>
              <button onClick={handleNewParticipantSubmit}>Submit</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Participants;