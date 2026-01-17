import React, { useMemo } from "react";
import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css"; // required base styles
import styles from "./calendar.module.css";

const CalendarComponent = ({
  selectedDate,
  setSelectedDate,
  setFromDate,
  setToDate,
  participants = [],
  lastDate,
}) => {
  /* ===== DATE → COUNT MAP ===== */
  const dateCountMap = useMemo(() => {
    const map = {};
    participants.forEach((p) => {
      map[p.date] = (map[p.date] || 0) + 1;
    });
    return map;
  }, [participants]);

  /* ===== HANDLE DATE CLICK ===== */
  const handleDateClick = (date) => {
    setSelectedDate(date);

    const dateStr = date.toLocaleDateString("en-CA");
    setFromDate(dateStr);
    setToDate(dateStr);
  };

  return (
    <div className={styles.dcdcc}>
      <div className={styles.simpleCalendar}>
        <Calendar
          value={selectedDate}
          maxDate={lastDate ? new Date(lastDate) : undefined}
          onClickDay={handleDateClick}
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const dateStr = date.toLocaleDateString("en-CA");
            const count = dateCountMap[dateStr];

            return count ? (
              <div className={styles.tileCount}>{count}</div>
            ) : null;
          }}
        />

        {/* ===== DAILY REGISTRATION COUNT ===== */}
        {selectedDate && (
          <div className={styles.regCount}>
            <strong>{selectedDate.toDateString()}</strong>
            <span>
              {
                participants.filter(
                  (p) =>
                    p.date ===
                    selectedDate.toLocaleDateString("en-CA")
                ).length
              }
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent;
