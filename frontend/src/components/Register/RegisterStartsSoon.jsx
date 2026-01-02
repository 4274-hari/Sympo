import { Clock, Lock } from "lucide-react";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";

export default function RegistrationStartsSoon() {
  const navigate = useNavigate();
  return (
    <div className={styles.containerclose}>
      <button className={`${styles.backButton} absolute top-10 left-4`} onClick={() => navigate(-1)}>Back</button>
      <div className={styles.cardclose}>
        <Clock size={64} className={styles.iconclose} />
        <h1 className={styles.titleclose}>Registration Starting Soon</h1>
        <p className={styles.textclose}>
          Registrations for <strong>Cognebula 2026</strong> Will start soon.
          <br />
          <a href="#events"
            onClick={(e) => {
              e.preventDefault();
              navigate("/#events");
            }}
            className="text-blue-400"
          >
            Meanwhile explore our events</a>
        </p>
      </div>
    </div>
  );
}