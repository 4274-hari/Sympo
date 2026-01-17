import React, { useState, useEffect } from "react";
import style from "./On_day.module.css";

const OnDay = () => {
  // Mock data - replace with API call in real implementation
  const initialParticipants = [
    {
      id: 1,
      name: "Rahul Sharma",
      registerNumber: "21BCE1001",
      phone: "+91 9876543210",
      email: "rahul.sharma@example.com",
      isCheckedIn: true,
      foodPreference: "Veg",
      certificateSent: true
    },
    {
      id: 2,
      name: "Priya Patel",
      registerNumber: "21BCE1002",
      phone: "+91 9876543211",
      email: "priya.patel@example.com",
      isCheckedIn: false,
      foodPreference: "Non-Veg",
      certificateSent: false
    },
    {
      id: 3,
      name: "Amit Kumar",
      registerNumber: "21BCE1003",
      phone: "+91 9876543212",
      email: "amit.kumar@example.com",
      isCheckedIn: true,
      foodPreference: "Veg",
      certificateSent: false
    },
    {
      id: 4,
      name: "Sneha Reddy",
      registerNumber: "21BCE1004",
      phone: "+91 9876543213",
      email: "sneha.reddy@example.com",
      isCheckedIn: true,
      foodPreference: "Non-Veg",
      certificateSent: true
    },
    {
      id: 5,
      name: "Vikram Singh",
      registerNumber: "21BCE1005",
      phone: "+91 9876543214",
      email: "vikram.singh@example.com",
      isCheckedIn: false,
      foodPreference: "Veg",
      certificateSent: false
    }
  ];

  // State management
  const [participants, setParticipants] = useState(initialParticipants);
  const [foodFilter, setFoodFilter] = useState("All");
  const [filteredParticipants, setFilteredParticipants] = useState(initialParticipants);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Calculate statistics
  const checkinCount = participants.filter(p => p.isCheckedIn).length;
  const vegCount = participants.filter(p => p.foodPreference === "Veg").length;
  const nonVegCount = participants.filter(p => p.foodPreference === "Non-Veg").length;
  const totalFoodCount = vegCount + nonVegCount;

  // Filter participants based on search only (food dropdown does NOT filter table)
  useEffect(() => {
    let filtered = [...participants];

    // Apply search filter only (foodFilter intentionally NOT used here)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.registerNumber.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.phone.includes(query)
      );
    }

    setFilteredParticipants(filtered);
  }, [participants, searchQuery]);

  return (
    <div className={style.container}>
      {/* Page Title */}
      <h1 className={style.pageTitle}>OnDay</h1>
      {/* Header Section */}
      <header className={style.header}>
        {/* Check-in Count */}
        <div className={style.countSection}>
          <h2 className={style.cardTitle}>Check-in Count</h2>
          <div className={style.checkinCount}>{checkinCount}</div>
          <p className={style.muted}>Total Participants: {participants.length}</p>
        </div>

        {/* Food Status */}
        <div className={`${style.countSection} ${style.foodStatus}`}>
          <h2 className={style.cardTitle}>Food Status</h2>

          <select
            className={style.foodDropdown}
            value={foodFilter}
            onChange={(e) => setFoodFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>

          <div className={style.foodCounts}>
            {/* If All selected, show Total prominently */}
            {foodFilter === "All" ? (
              <>
                <div className={style.foodTotalItem}>
                  <div className={style.foodTotalCount}>{totalFoodCount}</div>
                  <div className={style.foodLabel}>Total</div>
                </div>
                <div className={style.foodCountItem}>
                  <div className={`${style.foodCount} ${style.veg}`}>{vegCount}</div>
                  <div className={style.foodLabel}>Veg</div>
                </div>
                <div className={style.foodCountItem}>
                  <div className={`${style.foodCount} ${style.nonVeg}`}>{nonVegCount}</div>
                  <div className={style.foodLabel}>Non-Veg</div>
                </div>
              </>
            ) : foodFilter === "Veg" ? (
              <div className={style.singleFoodHighlight}>
                <div className={`${style.foodCount} ${style.veg}`}>{vegCount}</div>
                <div className={style.foodLabel}>Veg</div>
              </div>
            ) : (
              <div className={style.singleFoodHighlight}>
                <div className={`${style.foodCount} ${style.nonVeg}`}>{nonVegCount}</div>
                <div className={style.foodLabel}>Non-Veg</div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Error Message */}
      {error && <div className={style.error}>{error}</div>}

      {/* Table Title */}
      <h2 className={style.tableTitle}>E-Certificate</h2>
      {/* Search and Controls */}
      <div className={style.controls}>
        <input
          type="text"
          className={style.searchBar}
          placeholder="Search participants by name, email, or register number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Participants Table */}
      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead className={style.tableHeader}>
            <tr>
              <th>S.NO</th>
              <th>Name</th>
              <th>Register Number</th>
              <th>Phone Number</th>
              <th>Email ID</th>
              <th>Certificate Status</th>
            </tr>
          </thead>
          <tbody className={style.tableBody}>
            {filteredParticipants.map((participant,idx) => (
              <tr key={participant.id}>
                <td>{idx+1}</td>
                {/* Name */}
                <td data-label="Name">{participant.name}</td>
                {/* Register Number */}
                <td data-label="Register Number">{participant.registerNumber}</td>
                {/* Phone Number */}
                <td data-label="Phone Number">{participant.phone}</td>
                {/* Email ID */}
                <td data-label="Email ID">
                  <a href={`mailto:${participant.email}`}>
                    {participant.email}
                  </a>
                </td>
                {/* Certificate Status Icon */}
                <td data-label="Certificate Status" className={style.checkboxCell}>
                  <span
                    className={`${style.statusIcon} ${
                      participant.certificateSent ? style.statusSent : style.statusNotSent
                    }`}
                    title={participant.certificateSent ? "Certificate Sent" : "Certificate Not Sent"}
                  >
                    {participant.certificateSent ? "✓" : "✗"}
                  </span>
                </td>
              </tr>
            ))}
            {filteredParticipants.length === 0 && (
              <tr>
                <td colSpan={7} className={style.empty}>No participants match the search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnDay;
