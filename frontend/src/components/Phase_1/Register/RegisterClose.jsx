import { Lock } from "lucide-react";
import styles from "./register.module.css";

export default function RegistrationClosed() {
  return (
    <div className={styles.containerclose}>
      <div className={styles.cardclose}>
        <Lock size={64} className={styles.iconclose} />
        <h1 className={styles.titleclose}>Registration Closed</h1>
        <p className={styles.textclose}>
          Registrations for <strong>Cognebula 2026</strong> are now closed.
          <br />
          We look forward to seeing you at the event!
        </p>
      </div>
    </div>
  );
}