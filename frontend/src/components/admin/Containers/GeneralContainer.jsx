import { useEffect, useState } from "react";
import styles from "./container.module.css";
import api from "../../../api/axios";

import GeneralHome from "../General Home Dashboard/GeneralHomeDasbord";
import OnDay from "../On Day Dashboard/OnDayDash";
import EventDashboard from "../Event Dash/EventDashboard";
import PaymentDashboard from "../Payments/Payments";

const GeneralContainer = () => {
  const [activeTab, setActiveTab] = useState("home");

  const [dashboardData, setDashboardData] = useState({
    home: null,
    events: null,
    onDay: null,
    payments: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        if (response.data.success) {
          const { home, events, onDay, payments } = response.data.data;

          setDashboardData({
            home,
            events,
            onDay,
            payments,
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
        <div className={styles.navLogo}>Symposium Dashboard</div>
        <div className={styles.navLinks}>
          <a
            className={`${styles.navLink} ${activeTab === "home" ? styles.navLinkActive : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </a>
          <a
            className={`${styles.navLink} ${activeTab === "event" ? styles.navLinkActive : ""}`}
            onClick={() => setActiveTab("event")}
          >
            Events
          </a>
          <a
            className={`${styles.navLink} ${activeTab === "onday" ? styles.navLinkActive : ""}`}
            onClick={() => setActiveTab("onday")}
          >
            On-Day
          </a>
          <a
            className={`${styles.navLink} ${activeTab === "payment" ? styles.navLinkActive : ""}`}
            onClick={() => setActiveTab("payment")}
          >
            Payment
          </a>
        </div>
      </nav>

      {activeTab === "home" && <GeneralHome data={dashboardData.home} />}
      {activeTab === "event" && <EventDashboard data={dashboardData.events} />}
      {activeTab === "onday" && <OnDay data={dashboardData.onDay} />}
      {activeTab === "payment" && <PaymentDashboard data={dashboardData.payments} />}
    </div>
  );
};

export default GeneralContainer;