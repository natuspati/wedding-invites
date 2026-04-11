import RSVPTable from "@/components/admin/rsvp-table/RSVPTable";
import LoginForm from "@/components/admin/login/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/pages/AdminPage.module.css";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const { authenticated, loading, error, login, logout } = useAuth();

  if (loading) return null;

  if (!authenticated) {
    return <LoginForm onLogin={login} error={error} />;
  }

  return (
    <div className={styles.adminWrapper}>
      <div className={styles.adminHeader}>
        <div className={styles.leftHeaderSection}>
          <h2 className={styles.adminTitle}>Admin</h2>
        </div>

        <Link to="/" className={styles.logoutBtn}>
          Back to Site
        </Link>
        <button className={styles.logoutBtn} onClick={logout}>
          Exit
        </button>
      </div>
      <RSVPTable />
    </div>
  );
}
