import { useState } from "react";
import styles from "./container.module.css"
import GeneralHome from "../General Home Dashboard/GeneralHomeDasbord";
import OnDay from "../On Day Dashboard/OnDayDash";
import EventDashboard from "../Event Dash/EventDashboard";
import PaymentDashboard from "../Payments/Payments";

const GeneralContainer = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen p-5">
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>Symposium Dashboard</div>
        <div className={styles.navLinks}>
          <a className={`${styles.navLink} ${activeTab === "home" ? styles.navLinkActive : ""}`} onClick={() => setActiveTab("home")} >Home</a>
          <a className={`${styles.navLink} ${activeTab === "event" ? styles.navLinkActive : ""}`} onClick={() => setActiveTab("event")} >Events</a>
          <a className={`${styles.navLink} ${activeTab === "onday" ? styles.navLinkActive : ""}`} onClick={() => setActiveTab("onday")} >On-Day</a>
          <a className={`${styles.navLink} ${activeTab === "payment" ? styles.navLinkActive : ""}`} onClick={() => setActiveTab("payment")} >Payment</a>
        </div>
      </nav>

      {activeTab === "home" && <GeneralHome />}
      {activeTab === "onday" && <OnDay />}
      {activeTab === "event" && <EventDashboard />}
      {activeTab === "payment" && <PaymentDashboard />}
    </div>
  );
};

export default GeneralContainer;