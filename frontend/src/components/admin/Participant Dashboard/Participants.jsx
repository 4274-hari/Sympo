import React, { useState, useEffect } from 'react';
import styles from './Participants.module.css';
import CheckInStatus from '../Check In/CheckInStatus';

const Participants = () => {
  const sampleData = [
    { id: 1, name: 'Alice', mobile: '1234567890', email: 'alice@example.com', college: 'ABC College', year: '3' },
    // add more dummy participants to test pagination
  ];

  const [selectedIds, setSelectedIds] = useState(sampleData.map(p => p.id));
  const [isButtonEnabled, setButtonEnabled] = useState(false);
  const [buttonText, setButtonText] = useState('Send Certificates');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('participants');

  const participantsPerPage = 20;

  useEffect(() => {
    const symposiumDate = new Date('2026-02-07T00:00:00');
    const now = new Date();
    if (now >= symposiumDate) {
      setButtonEnabled(true);
    }
  }, []);

  const handleSendCertificates = () => {
    if (isButtonEnabled) {
      setButtonText('Send');
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const filteredParticipants = sampleData.filter(part =>
    part.id.toString().includes(searchTerm) ||
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.mobile.includes(searchTerm) ||
    part.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dataToDisplay = searchTerm ? filteredParticipants : sampleData;
  const indexOfLast = currentPage * participantsPerPage;
  const indexOfFirst = indexOfLast - participantsPerPage;
  const currentParticipants = dataToDisplay.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(dataToDisplay.length / participantsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <button 
          className={`${styles.link} ${activeTab === 'participants' ? styles.active : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          Participants
        </button>
        <button 
          className={`${styles.link} ${activeTab === 'checkin' ? styles.active : ''}`}
          onClick={() => setActiveTab('checkin')}
        >
          Check-In Status
        </button>
      </div>

      {activeTab === 'participants' && (
        <>
          <h2 className={styles.heading}>Participants</h2>

          <div className={styles.topBar}>
            <input
              type="text"
              placeholder="Search by ID, name, mobile, email, or college..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchBox}
            />

            <button onClick={handleSendCertificates} disabled={!isButtonEnabled}>
              {buttonText}
            </button>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Select</th>
                <th>ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>College</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {currentParticipants.map(part => (
                <tr key={part.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(part.id)}
                      onChange={() => toggleSelection(part.id)}
                      disabled={!isButtonEnabled}
                    />
                  </td>
                  <td>{part.id}</td>
                  <td>{part.name}</td>
                  <td>{part.mobile}</td>
                  <td>{part.email}</td>
                  <td>{part.college}</td>
                  <td>{part.year}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!searchTerm && totalPages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? styles.activePage : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'checkin' && <CheckInStatus />}
    </div>
  );
};

export default Participants;