import { AlertTriangle, Home } from "lucide-react";
import styles from "./notfound.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <AlertTriangle size={72} />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you’re looking for doesn’t exist or was moved.</p>

        <a href="/" className={styles.homeBtn}>
          <Home size={16} color="#000" className="mt-2"/> Go Home
        </a>
      </div>
    </div>
  );
}