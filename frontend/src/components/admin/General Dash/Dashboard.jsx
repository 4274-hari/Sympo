import React, { useState } from "react";
import eventsData from "./Dashcount.json";
import styles from "./Dashboard.module.css";
import { ChevronDown, ChevronUp, User } from "lucide-react";

const Dashboard = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Events Overview</h2>

      <div className={styles.grid}>
        {Object.entries(eventsData).map(([key, category], index) => {
          const totalParticipants = category.events.reduce(
            (sum, e) => sum + (e.totalParticipants || 0),
            0
          );

          // use the JSON flag to decide whether this category is collapsible
          const hasDropdown = Boolean(category.dropdown);

          const hasEvents = category.events && category.events.length > 0;
          const isOpen = openIndex === index;

          return (
            <div key={key} className={styles.card}>
              {/* HEADER */}
              <div
                className={styles.header}
                onClick={
                  hasDropdown && hasEvents ? () => toggleDropdown(index) : undefined
                }
                style={{
                  cursor: hasDropdown && hasEvents ? "pointer" : "default",
                }}
                role={hasDropdown && hasEvents ? "button" : undefined}
                aria-expanded={hasDropdown ? !!isOpen : undefined}
              >
                <div>
                  <h3>{category.categoryName}</h3>
                  <p>
                    {category.totalEvents}{" "}
                    {category.totalEvents === 1 ? "Event" : "Events"}
                  </p>
                </div>

                <div className={styles.headerRight}>
                  <span className={styles.count}>
                    <User size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    {totalParticipants} Participants
                  </span>

                  {/* Chevron only if dropdown is meaningful */}
                  {hasDropdown && hasEvents && (
                    <span className={styles.chevron}>
                      {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  )}
                </div>
              </div>

              {/* CONTENT */}
              {hasDropdown ? (
                <div
                  className={`${styles.dropdown} ${isOpen ? styles.open : ""}`}
                >
                  {hasEvents ? (
                    category.events.map((event, i) => (
                      <div key={i} className={styles.row}>
                        <span>{event.name}</span>
                        <span>{event.type}</span>
                        <span className={styles.small}>
                          {event.totalParticipants}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.empty}>Events will be announced soon</div>
                  )}
                </div>
              ) : (
                <div 
                // className={styles.staticContent}
                >
                  {hasEvents ? (
                    category.events.map((event, i) => (
                      <div
                        key={i}
                      //   className={`${styles.row} ${styles.workshopRow}`
                      // }
                      >
                        {/* <span>{event.name}</span>
                        <span className={styles.small}>
                          {event.totalParticipants}
                        </span> */}
                      </div>
                    ))
                  ) : (
                    <div className={styles.empty}>No workshops available</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
