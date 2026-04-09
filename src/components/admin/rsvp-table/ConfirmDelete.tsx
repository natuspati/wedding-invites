import styles from "@/components/admin/rsvp-table/RSVPTable.module.css";

interface ConfirmDeleteProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ConfirmDelete({
  isOpen,
  onConfirm,
  onCancel,
  isLoading
}: ConfirmDeleteProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h4>Confirm Deletion</h4>
        <p>Are you sure you want to delete this RSVP? This action cannot be undone.</p>
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}