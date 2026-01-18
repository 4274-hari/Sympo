import React, { useState, useMemo, useEffect } from "react";
import data from "./payments.json";
import styles from "./payment.module.css";
import CalendarComponent from "./CalendarDesign.jsx";
import api from "../../../api/axios.js";

const LAST_DATE = "2026-02-07";

const PaymentDashboard = ({ data: initialData }) => {
  const [dashboardData, setDashboardData] = useState(initialData);
  const [filter, setFilter] = useState("total");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(LAST_DATE);
  const [selectedDate, setSelectedDate] = useState(null);

  /* ================= FILTER DATA ================= */
  useEffect(() => {
    if (filter !== "calendar" || !fromDate || !toDate) {
      setDashboardData(initialData);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/admin/dashboard", {
          params: {
            date:fromDate
          },
        });
        
        setDashboardData(response.data.data.payments);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchDashboardData();
  }, [filter, fromDate, toDate, initialData]);

  /* ================= SUMMARY ================= */
  const summary = useMemo(() => {
    return {
      totalCount: dashboardData.totalRegistrations,
      expectedAmount: dashboardData.totalAmount,
      events: {
        count: dashboardData.pricing.event.count,
        expected: dashboardData.pricing.event.amount,
      },
      workshops: {
        count: dashboardData.pricing.workshop.count,
        expected: dashboardData.pricing.workshop.amount,
      },
      blacklistedParticipants: dashboardData.blacklistedParticipants
    };
  }, [dashboardData]);

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
          // participants={data.blacklistedParticipants}
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
                {summary.blacklistedParticipants.map((p, i) => (
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
