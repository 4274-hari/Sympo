import React, { useState } from "react";
import eventsData from "./EventDashcount.json";
import styles from "./EventDashboard.module.css";
import { ChevronDown, User, X } from "lucide-react";

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const openPopup = (categoryKey) => {
    setActiveCategory(categoryKey);
  };

  const closePopup = () => {
    setActiveCategory(null);
  };

  // Get the active category data
  const activeCategoryData = activeCategory ? eventsData[activeCategory] : null;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Events Overview</h2>

      <div className={styles.grid}>
        {Object.entries(eventsData).map(([key, category]) => {
          const hasEvents = category.events?.length > 0;
          const isClickable = category.dropdown && hasEvents;

          const totalParticipants = category.events.reduce(
            (sum, event) => sum + (event.totalParticipants || 0),
            0
          );

          return (
            <div key={key} className={styles.card}>
              {/* ================= CARD HEADER ================= */}
              <div
                className={styles.header}
                onClick={isClickable ? () => openPopup(key) : undefined}
                style={{
                  cursor: isClickable ? "pointer" : "default",
                }}
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
                    <User size={14} style={{ marginRight: 6 }} />
                    {totalParticipants} Participants
                  </span>

                  {isClickable && (
                    <span className={styles.chevron}>
                      <ChevronDown />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= GLOBAL MODAL/POPUP ================= */}
      {activeCategory && (
        <div className={styles.modalOverlay} onClick={closePopup}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className={styles.modalHeader}>
              <h3>{activeCategoryData.categoryName}</h3>
              <X
                size={20}
                className={styles.close}
                onClick={closePopup}
              />
            </div>

            {/* MODAL CONTENT */}
            <div className={styles.modalContent}>
              {activeCategoryData.events?.length > 0 ? (
                activeCategoryData.events.map((event, i) => (
                  <div key={i} className={styles.row}>
                    <span>{event.name}</span>
                    <span>{event.type}</span>
                    <span className={styles.small}>
                      {event.totalParticipants}
                    </span>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  Events will be announced soon
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;