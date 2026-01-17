import { useState } from "react";
import styles from "./container.module.css"
import Participants from "../Participant Dashboard/Participants";
import CheckInStatus from "../Check In Dashboard/CheckInStatus";

const EventContainer = () => {
  const [activeTab, setActiveTab] = useState("participants");
  return (
    <div className="min-h-screen p-5">
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>Symposium Event Dashboard</div>
        <div className={styles.navLinks}>
          <a className={`${styles.navLink} ${activeTab === "participants" ? styles.navLinkActive : ""}`} onClick={() => setActiveTab("participants")} >Participants</a>
          <a className={`${styles.navLink} ${activeTab === "checkin" ? styles.navLinkActive : ""}`} onClick={() => setActiveTab("checkin")} >Check-In Status</a>
        </div>
      </nav>

      {activeTab === "participants" && <Participants />}
      {activeTab === "checkin" && <CheckInStatus />}
    </div>
  );
};

export default EventContainer;