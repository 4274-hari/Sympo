import React, { useMemo, useState } from "react";
import style from "./On_day.module.css";

/* ---------- EVENT META ---------- */
const EVENT_META = {
  "Auction Arena": { mode: "Non-Tech", type: "Team", isBoth: false },
  "Flashback": { mode: "Non-Tech", type: "Team", isBoth: true },
  "Cinefrenzy": { mode: "Non-Tech", type: "Team", isBoth: true },
  "Battle of Thrones": { mode: "Non-Tech", type: "Team", isBoth: false },
  "Beyond the Gate": { mode: "Non-Tech", type: "Team", isBoth: false },
  "Rhythmia": { mode: "Non-Tech", type: "Team", isBoth: true },
  "Agent Fusion": { mode: "Tech", type: "Team", isBoth: true },
  "Paper Podium": { mode: "Tech", type: "Team", isBoth: false },
  "Prompt Craft": { mode: "Tech", type: "Team", isBoth: true },
  "HackQuest": { mode: "Tech", type: "Team", isBoth: false },
  "Query Clash": { mode: "Tech", type: "Individual", isBoth: true },
  "Shark Tank": { mode: "Tech", type: "Team", isBoth: false },
  "Workshop": { mode: "Workshop", type: "Individual", isBoth: false },
};

const OnDay = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [foodFilter, setFoodFilter] = useState("All");

  /**
   * Merge API certificates + static event meta
   */
  const events = useMemo(() => {
    if (!data?.certificates) return [];

    return data.certificates.map((item) => {
      const meta = EVENT_META[item.event_name] || {};

      return {
        name: item.event_name,
        mode: meta.mode || "—",
        type: meta.type || "—",
        session: meta.isBoth ? "Morning & Evening" : "Single Session",
        certificateSent: item.e_certificate_sent,
      };
    });
  }, [data]);

  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const vegCount = data?.food.vegEaten
  const nonVegCount = data?.food.nonvegEaten
  const totalFoodCount = vegCount + nonVegCount;

  if (!data) return <p className="p-5">Loading on-day data...</p>;

  return (
    <div className={style.container}>
      {/* Page Title */}
      <h1 className={style.pageTitle}>On-Day Events</h1>

      {/* SUMMARY */}
      <header className={style.header}>
        <div className={style.countSection}>
          <h2 className={style.cardTitle}>Check-in Count</h2>
          <div className={style.checkinCount}>
            {data.checkInCount}
          </div>
        </div>

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
                {/* <div className={style.foodCountItem}>
                  <div className={`${style.foodCount} ${style.veg}`}>{vegCount}</div>
                  <div className={style.foodLabel}>Veg</div>
                </div>
                <div className={style.foodCountItem}>
                  <div className={`${style.foodCount} ${style.nonVeg}`}>{nonVegCount}</div>
                  <div className={style.foodLabel}>Non-Veg</div>
                </div> */}
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

      {/* TABLE TITLE */}
      <h2 className={style.tableTitle}>E-Certificates</h2>

      {/* SEARCH */}
      <div className={style.controls}>
        <input
          type="text"
          className={style.searchBar}
          placeholder="Search by event name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead className={style.tableHeader}>
            <tr>
              <th>S.No</th>
              <th>Event Name</th>
              <th>Mode</th>
              <th>Type</th>
              <th>Session</th>
              <th>Certificate</th>
            </tr>
          </thead>

          <tbody className={style.tableBody}>
            {filteredEvents.map((event, idx) => (
              <tr key={event.name}>
                <td>{idx + 1}</td>
                <td>{event.name}</td>
                <td>{event.mode}</td>
                <td>{event.type}</td>
                <td>{event.session}</td>
                <td className={style.checkboxCell}>
                  <span
                    className={`${style.statusIcon} ${
                      event.certificateSent
                        ? style.statusSent
                        : style.statusNotSent
                    }`}
                  >
                    {event.certificateSent ? "✓" : "✗"}
                  </span>
                </td>
              </tr>
            ))}

            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan={6} className={style.empty}>
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnDay;