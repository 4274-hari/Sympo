import { useEffect, useMemo, useState } from "react";
import styles from "./container.module.css";

import Participants from "../Participant Dashboard/Participants";
import ParticipantsTeam from "../Participant Dashboard/Participants-Team";

import CheckInStatus from "../Check In Dashboard/CheckInStatus";
import CheckInStatusTeam from "../Check In Dashboard/CheckInStatus-Team";

import { isTeamEvent } from "../../../utils/eventType";
import api from "../../../api/axios";

const EventContainer = () => {
  const [activeTab, setActiveTab] = useState("participants");
  const [dashboardData, setDashboardData] = useState({
    participants: null,
    morningSessionParticipants: null,
    afternoonSessionParticipants: null
  });
  
  const role = localStorage.getItem("role") ?? "";
  
  const teamEvent = useMemo(() => {
    return isTeamEvent(role);
  }, [role]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/event/data");
        console.log(response.data);
        

        if (response.data.success) {
          const { participants, morningSessionParticipants, afternoonSessionParticipants } = response.data;

          setDashboardData({
            participants,
            morningSessionParticipants,
            afternoonSessionParticipants
          });
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="p-5">Loading dashboard...</p>;
  if (error) return <p className="p-5 text-red-500">{error}</p>;


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
        (teamEvent ? (
          <ParticipantsTeam
            participants={dashboardData.participants}
          />
        ) : (
          <Participants
            participants={dashboardData.participants}
          />
        ))}

      {/* CHECK-IN */}
      {activeTab === "checkin" &&
        (teamEvent ? (
          <CheckInStatusTeam
            morningSessionParticipants={dashboardData.morningSessionParticipants}
            afternoonSessionParticipants={dashboardData.afternoonSessionParticipants}
          />
        ) : (
          <CheckInStatus
            morningSessionParticipants={dashboardData.morningSessionParticipants}
            afternoonSessionParticipants={dashboardData.afternoonSessionParticipants}
          />
        ))}
    </div>
  );
};

export default EventContainer;