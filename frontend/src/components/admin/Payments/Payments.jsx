import React, { useState, useMemo } from "react";
import data from "./payments.json";
import styles from "./payment.module.css";
import CalendarComponent from "./CalendarDesign.jsx";

const LAST_DATE = "2026-02-07";

const PaymentDashboard = () => {
  const [filter, setFilter] = useState("total");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(LAST_DATE);
  const [selectedDate, setSelectedDate] = useState(null);

  /* ================= DATE → COUNT MAP ================= */
  const dateCountMap = useMemo(() => {
    const map = {};
    data.participants.forEach((p) => {
      map[p.date] = (map[p.date] || 0) + 1;
    });
    return map;
  }, []);

  /* ================= FILTER DATA ================= */
  const filteredData = useMemo(() => {
    if (filter !== "calendar" || !fromDate) return data.participants;

    return data.participants.filter(
      (p) => p.date >= fromDate && p.date <= toDate
    );
  }, [filter, fromDate, toDate]);

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    const events = filteredData.filter((p) => p.type === "event");
    const workshops = filteredData.filter((p) => p.type === "workshop");

    return {
      totalCount: filteredData.length,
      expectedAmount: filteredData.reduce((s, p) => s + p.amount, 0),
      events: {
        count: events.length,
        expected: events.reduce((s, p) => s + p.amount, 0),
      },
      workshops: {
        count: workshops.length,
        expected: workshops.reduce((s, p) => s + p.amount, 0),
      },
    };
  }, [filteredData]);

  return (
    <div className={styles.wrapper}>
      {/* ================= HEADER ================= */}
      <div className={styles.topBar}>
        <h2>Payments</h2>

        <select
          className={styles.dropdown}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="total">Total</option>
          <option value="calendar">Calendar</option>
          <option value="blocklist">Blocklist</option>
        </select>
      </div>

      {/* ================= CALENDAR ================= */}
{filter === "calendar" && (
  <CalendarComponent
    selectedDate={selectedDate}
    className={styles.calendar}
    setSelectedDate={setSelectedDate}
    setFromDate={setFromDate}
    setToDate={setToDate}
    participants={data.participants}
    lastDate={LAST_DATE}
    styles={styles}
  />
)}


      {/* ================= SUMMARY ================= */}
      <div className={styles.centerSummary}>
        <h1>{summary.totalCount}</h1>
        <p>₹ Expected: {summary.expectedAmount}</p>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.miniCard}>
          <h4>Events</h4>
          <span>{summary.events.count}</span>
          <small>₹ {summary.events.expected}</small>
        </div>

        <div className={styles.miniCard}>
          <h4>Workshops</h4>
          <span>{summary.workshops.count}</span>
          <small>₹ {summary.workshops.expected}</small>
        </div>
      </div>

      {/* ================= BLOCKLIST TABLE ================= */}
      {filter === "blocklist" && (
        <div>
          <span className={styles.blockTitle}>Blocklist</span>

          <div className={styles.tableCard}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Part ID</th>
                  <th>Name</th>
                  <th>Event</th>
                  <th>Mobile</th>
                  <th>Mail</th>
                  <th>College</th>
                  <th>Year</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((p, i) => (
                  <tr key={i}>
                    <td>{p.date}</td>
                    <td>{p.partId}</td>
                    <td>{p.name}</td>
                    <td>{p.event}</td>
                    <td>{p.mobile}</td>
                    <td>{p.mail}</td>
                    <td>{p.college}</td>
                    <td>{p.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;
