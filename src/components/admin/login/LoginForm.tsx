import { useState } from "react";
import styles from "@/pages/AdminPage.module.css";

interface LoginFormProps {
  onLogin: (password: string, username: string) => void;
  error: boolean;
}

export default function LoginForm({ onLogin, error }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password, username);
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginTitle}>Әкімші кіру</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.loginInput}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.loginInput}
            autoComplete="current-password"
          />
          {error && <p className={styles.loginError}>Username or password is wrong</p>}
          <button type="submit" className={styles.loginBtn}>Sign in</button>
        </form>
      </div>
    </div>
  );
}