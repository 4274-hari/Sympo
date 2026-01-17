import React, { useState, useEffect } from "react";
import styles from "./CoordinatorCheckin.module.css";

const symposiumDate = new Date("2026-01-07T00:00:00");

const CoordinatorCheckin = () => {
  const [participants, setParticipants] = useState([
    {
      id: "COG-504",
      name: "Alice",
      events: ["Ideathon", "Hackathon"],
      year: "3",
      college: "ABC College",
      mobile: "9876543210",
      email: "alice@mail.com",
      blacklist: false,
      entered: false,
      checkedIn: false,
      secondaryMail: ""
    },
    {
      id: "COG-505",
      name: "Bob",
      events: ["Debugging"],
      year: "2",
      college: "XYZ College",
      mobile: "9999999999",
      email: "bob@mail.com",
      blacklist: true,
      entered: false,
      checkedIn: false,
      secondaryMail: ""
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("overall"); // overall | blacklist
  const [totalRegistration, setTotalRegistration] = useState(0);
  const [totalCheckedIn, setTotalCheckedIn] = useState(0);

  const [confirmEnterId, setConfirmEnterId] = useState(null);

  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const now = new Date();
    if (now >= symposiumDate) {
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    setTotalRegistration(participants.length);
    setTotalCheckedIn(participants.filter(p => p.checkedIn).length);
  }, [participants]);

  const filteredParticipants = participants.filter((p) => {
    const keyword = searchTerm.toLowerCase();
    const idMatch = p.id.toLowerCase().includes(keyword) || p.id.split("-")[1]?.includes(keyword);
    const nameMatch = p.name.toLowerCase().includes(keyword);
    const mobileMatch = p.mobile.includes(keyword);
    const emailMatch = p.email.toLowerCase().includes(keyword);

    const baseMatch = idMatch || nameMatch || mobileMatch || emailMatch;

    if (!baseMatch) return false;

    if (filterMode === "blacklist") return p.blacklist;
    return true;
  });

  const handleCheckin = (id) => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === id ? { ...p, checkedIn: true } : p
      )
    );

    fetch("http://localhost:5000/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: id })
    });
  };

  const handleEnterConfirm = () => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === confirmEnterId ? { ...p, entered: true } : p
      )
    );

    fetch("http://localhost:5000/api/mark_entered", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: confirmEnterId })
    });

    setConfirmEnterId(null);
  };

  const handleSecondaryMailChange = (id, value) => {
    setParticipants(prev =>
      prev.map(p =>
        p.id === id ? { ...p, secondaryMail: value } : p
      )
    );
  };

  return (
    <div className={styles.container}>
      
      {/* 🔥 TOP BAR */}
      <div className={styles.topRow}>
        
        {/* LEFT SIDE */}
        <div className={styles.leftControls}>
          <input
            type="text"
            placeholder="Search participant..."
            className={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={styles.filterBox}>
            <label>
              <input
                type="radio"
                checked={filterMode === "overall"}
                onChange={() => setFilterMode("overall")}
              />
              Overall
            </label>

            <label>
              <input
                type="radio"
                checked={filterMode === "blacklist"}
                onChange={() => setFilterMode("blacklist")}
              />
              Blacklist
            </label>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.rightControls}>
          <div className={styles.countCard}>
            Total Registration: {totalRegistration}
          </div>

          <div
            className={styles.countCard}
            style={{ opacity: isLocked ? 0.4 : 1 }}
          >
            Total Checked In: {totalCheckedIn}
          </div>

          <button className={styles.newBtn} disabled={isLocked}>
            New Registration
          </button>
        </div>
      </div>


      {/* 🔥 TABLE */}
      <div className={styles.tableWrapper}>
        <div className={styles.headerRow}>
          <span>PART ID</span>
          <span>NAME</span>
          <span>EVENTS</span>
          <span>YEAR</span>
          <span>COLLEGE</span>
          <span>MOBILE</span>
          <span>MAIL</span>
          <span>SECONDARY MAIL</span>
          <span>CHECK IN</span>
          <span>ENTER</span>
        </div>

        {filteredParticipants.map((p) => (
          <div
            key={p.id}
            className={`${styles.dataRow} ${p.entered ? styles.disabledRow : ""}`}
          >
            <span>{p.id}</span>
            <span>{p.name}</span>
            <span>{p.events.join(", ")}</span>
            <span>{p.year}</span>
            <span>{p.college}</span>
            <span>{p.mobile}</span>
            <span>{p.email}</span>

            <input
              type="text"
              value={p.secondaryMail}
              onChange={(e) => handleSecondaryMailChange(p.id, e.target.value)}
              disabled={isLocked || p.entered}
            />

            {/* CHECK-IN BUTTON */}
            <button
              className={styles.checkinBtn}
              disabled={isLocked || p.entered}
              onClick={() => handleCheckin(p.id)}
            >
              Checkin
            </button>

            {/* ENTRY BUTTON */}
            <button
              className={styles.entryBtn}
              disabled={isLocked || p.entered}
              onClick={() => setConfirmEnterId(p.id)}
            >
              ✔
            </button>
          </div>
        ))}
      </div>


      {/* 🔥 MODAL */}
      {confirmEnterId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <p>Mark participant {confirmEnterId} as entered?</p>
            <button onClick={handleEnterConfirm}>OK</button>
            <button onClick={() => setConfirmEnterId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorCheckin;
