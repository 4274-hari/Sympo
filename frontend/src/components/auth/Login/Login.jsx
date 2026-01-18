import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, CalendarDays, LogIn } from "lucide-react";
import styles from "./login.module.css";
import api from "../../../api/axios";

const RoleLogin = () => {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !dob) {
      setError("Email and DOB are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/login", { email, dob });

      const role = res?.data?.user?.role;
      
      if (!role) {
        setError("Login failed: role not provided");
        return;
      }

      // Persist role (and basic user info if needed)
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const roleRoutes = {
        general: "/admin/general",
        registration: "/admin/register",
        food: "/admin/scanner",
      };

      const EVENT_ROLES = [
        "auction_arena",
        "flashback",
        "cinefrenzy",
        "battle_of_thrones",
        "beyond_the_gate",
        "rhythmia",
        "agent_fusion",
        "paper_podium",
        "prompt_craft",
        "hackquest",
        "query_clash",
        "shark_tank",
        "workshop",
      ];

      if (EVENT_ROLES.includes(role)) {
        navigate("/admin/events");
      } else if (roleRoutes[role]) {
        navigate(roleRoutes[role]);
      } else {
        setError(`Unsupported role: ${role}`);
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Invalid credentials or server error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.leftContent}>
            <h2>Welcome Back</h2>
            <p>Access your services securely.</p>
          </div>
        </div>

        <div className={styles.right}>
          <h3 className={styles.title}>Login</h3>

          {/* EMAIL */}
          <div className={styles.inputBox}>
            <User size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* DOB */}
          <div className={styles.inputBox}>
            <CalendarDays size={18} />
            <input
              type="password"
              placeholder="DOB"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.loginBtn} onClick={handleLogin} disabled={loading}>
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;