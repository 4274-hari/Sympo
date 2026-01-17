import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import styles from "./login.module.css";

const RoleLogin = () => {
  const [role, setRole] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const CREDENTIALS = {
    general: {
      username: "general",
      password: "general@123",
      redirect: "/admin/general/events",
    },
    coordinator: {
      username: "coordinator",
      password: "event@123",
      redirect: "/coordinator/dashboard",
    },
  };

  const handleLogin = () => {
    const valid = CREDENTIALS[role];

    if (username === valid.username && password === valid.password) {
      localStorage.setItem("role", role);
      navigate(valid.redirect);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* LEFT PANEL (background panel) */}
        <div className={styles.left}>
          <div className={styles.leftContent}>
            <h2>{role === "general" ? "Welcome Back" : "Event Dashboard"}</h2>
            <p>
              {role === "general"
                ? "Access your general services securely."
                : "Manage and coordinate events with full control."}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.right}>
          <h3 className={styles.title}> <h3>Login</h3></h3>

          {/* ROLE SWITCH */}
          <div className={styles.roleSwitch}>
            <label>
              <input
                type="radio"
                checked={role === "general"}
                onChange={() => setRole("general")}
              />
              General
            </label>

            <label>
              <input
                type="radio"
                checked={role === "coordinator"}
                onChange={() => setRole("coordinator")}
              />
              Event Coordinator
            </label>
          </div>

          {/* USERNAME */}
          <div className={styles.inputBox}>
            <User size={18} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className={styles.inputBox}>
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {/* LOGIN BUTTON */}
          <button className={styles.loginBtn} onClick={handleLogin}>
            <LogIn size={18} />
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;
