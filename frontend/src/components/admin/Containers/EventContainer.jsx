import { useMemo, useState } from "react";
import styles from "./container.module.css";

import Participants from "../Participant Dashboard/Participants";
import ParticipantsTeam from "../Participant Dashboard/Participants-Team";

import CheckInStatus from "../Check In Dashboard/CheckInStatus";
import CheckInStatusTeam from "../Check In Dashboard/CheckInStatus-Team";

import { isTeamEvent } from "../../../utils/eventType";

const EventContainer = () => {
  const [activeTab, setActiveTab] = useState("participants");


  const role = localStorage.getItem("role") ?? "";

  const teamEvent = useMemo(() => {
    return isTeamEvent(role);
  }, [role]);

  return (
    <div className="min-h-screen p-5">
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>Symposium Event Dashboard</div>
        <div className={styles.navLinks}>
          <a
            className={`${styles.navLink} ${
              activeTab === "participants" ? styles.navLinkActive : ""
            }`}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </a>

          <a
            className={`${styles.navLink} ${
              activeTab === "checkin" ? styles.navLinkActive : ""
            }`}
            onClick={() => setActiveTab("checkin")}
          >
            Check-In Status
          </a>
        </div>
      </nav>

      {/* PARTICIPANTS */}
      {activeTab === "participants" &&
        (teamEvent ? <ParticipantsTeam /> : <Participants />)}

      {/* CHECK-IN */}
      {activeTab === "checkin" &&
        (teamEvent ? <CheckInStatusTeam /> : <CheckInStatus />)}
    </div>
  );
};

export default EventContainer;