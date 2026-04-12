import { useState, useEffect, useRef } from "react";
import config from "@/config";
import type { RSVPInDB } from "@/components/rsvp/RSVP.shema";
import ConfirmDelete from "@/components/admin/rsvp-table/ConfirmDelete";
import styles from "@/components/admin/rsvp-table/RSVPTable.module.css";
import { getDefaultDates } from "@/utils/date";
import type { PaginatedRSVP } from "@/components/admin/rsvp-table/RSVPTable.schema";
import { PaginatedRSVPSchema } from "@/components/admin/rsvp-table/RSVPTable.schema";
import { RSVPInDBSchema } from "@/components/rsvp/RSVP.shema";

const STATUS_LABELS: Record<string, string> = {
  accepted_solo: "Accepted Solo",
  accepted_duo: "Accepted Duo",
  rejected: "Rejected",
};

const STATUS_CLASS: Record<string, string> = {
  accepted_solo: styles.statusSolo,
  accepted_duo: styles.statusDuo,
  rejected: styles.statusNo,
};

interface EditState {
  id: number;
  name: string;
  partner_name: string;
}

export default function RSVPTable() {
  const defaults = getDefaultDates();

  const [rows, setRows] = useState<RSVPInDB[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nameFilter, setNameFilter] = useState("");
  const [startFilter, setStartFilter] = useState(defaults.start);
  const [endFilter, setEndFilter] = useState(defaults.end);

  const [appliedName, setAppliedName] = useState("");
  const [appliedStart, setAppliedStart] = useState(defaults.start);
  const [appliedEnd, setAppliedEnd] = useState(defaults.end);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingRow, setEditingRow] = useState<EditState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const attendanceCount = rows.reduce((acc, r) => {
    if (r.status === "rejected") return acc;
    return acc + (r.status === "accepted_duo" ? 2 : 1);
  }, 0);

  async function fetchPage(
    pageNum: number,
    name: string,
    start: string,
    end: string,
    reset: boolean
  ) {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(pageNum),
      page_size: String(config.RSVPTablePageSize),
    });
    if (name) params.set("name", name);
    if (start) {
      const startDate = new Date(`${start}T00:00:00`);
      params.set("start", startDate.toISOString());
    }
    if (end) {
      const endDate = new Date(`${end}T23:59:59`);
      params.set("end", endDate.toISOString());
    }

    try {
      const res = await fetch(
        `${config.apiUrl}/api/v1/rsvp?${params.toString()}`
      );
      if (!res.ok) throw new Error("Server error");

      const json = await res.json();
      const data: PaginatedRSVP = PaginatedRSVPSchema.parse(json);

      setTotal(data.total);
      setRows((prev) => (reset ? data.contents : [...prev, ...data.contents]));

      pageRef.current = pageNum + 1;
      hasMoreRef.current = pageNum * config.RSVPTablePageSize < data.total;
    } catch (error) {
      console.log(`Error fetching RSVPs: ${error}`);
      setError("Failed to fetch RSVPs");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    pageRef.current = 1;
    hasMoreRef.current = true;
    loadingRef.current = false;
    setRows([]);
    setTotal(0);
    fetchPage(1, appliedName, appliedStart, appliedEnd, true);
  }, [appliedName, appliedStart, appliedEnd]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMoreRef.current &&
        !loadingRef.current
      ) {
        fetchPage(
          pageRef.current,
          appliedName,
          appliedStart,
          appliedEnd,
          false
        );
      }
    });

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [appliedName, appliedStart, appliedEnd]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setAppliedName(nameFilter);
    setAppliedStart(startFilter);
    setAppliedEnd(endFilter);
  }

  function handleReset() {
    const d = getDefaultDates();
    setNameFilter("");
    setStartFilter(d.start);
    setEndFilter(d.end);
    setAppliedName("");
    setAppliedStart(d.start);
    setAppliedEnd(d.end);
  }

  function openDeleteModal(id: number) {
    setDeleteTargetId(id);
  }

  async function handleConfirmDelete() {
    if (deleteTargetId === null) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${config.apiUrl}/api/v1/rsvp/${deleteTargetId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();

      setRows((prev) => prev.filter((r) => r.id !== deleteTargetId));
      setTotal((t) => t - 1);
      setDeleteTargetId(null);
    } catch {
      alert("Failed to delete RSVP");
    } finally {
      setIsDeleting(false);
    }
  }

  function startEditing(row: RSVPInDB) {
    setEditError(null);
    setEditingRow({
      id: row.id,
      name: row.name ?? "",
      partner_name: row.partner_name ?? "",
    });
  }

  function cancelEditing() {
    setEditingRow(null);
    setEditError(null);
  }

  async function handleSaveEdit() {
    if (!editingRow) return;

    setIsSaving(true);
    setEditError(null);

    const body: Record<string, string | null> = {
      name: editingRow.name.trim() || null,
      partner_name: editingRow.partner_name.trim() || null,
    };

    try {
      const res = await fetch(`${config.apiUrl}/api/v1/rsvp/${editingRow.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.detail ?? "Failed to save");
      }

      const json = await res.json();
      const updated = RSVPInDBSchema.parse(json);

      setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setEditingRow(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  }

  const isUnchanged =
    editingRow !== null &&
    (() => {
      const row = rows.find((r) => r.id === editingRow.id);
      return (
        row &&
        (editingRow.name.trim() || null) === row.name &&
        (editingRow.partner_name.trim() || null) === row.partner_name
      );
    })();

  const hasPartnerWithoutName =
    editingRow !== null &&
    !editingRow.name.trim() &&
    !!editingRow.partner_name.trim();

  return (
    <div className={styles.wrapper}>
      <h3>RSVP Table</h3>
      <form onSubmit={handleSearch} className={styles.filters}>
        <input
          className={styles.filterInput}
          type="text"
          placeholder="Search by name (ilike query)"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <input
          className={styles.filterInput}
          type="date"
          value={startFilter}
          onChange={(e) => setStartFilter(e.target.value)}
          title="Start Date"
        />
        <input
          className={styles.filterInput}
          type="date"
          value={endFilter}
          onChange={(e) => setEndFilter(e.target.value)}
          title="End Date"
        />
        <button type="submit" className={styles.filterBtn}>
          Search
        </button>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          Clear
        </button>
      </form>

      <div className={styles.statsBar}>
        <span>
          Total RSVPs: <strong>{total}</strong>
        </span>
        <span>
          Total guests who accepted: <strong>{attendanceCount}</strong>
          {rows.length < total && (
            <span className={styles.statsNote}> (loaded)</span>
          )}
        </span>
      </div>

      <ConfirmDelete
        isOpen={deleteTargetId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        isLoading={isDeleting}
      />

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Partner's name</th>
              <th>Status</th>
              <th>Creation date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isEditing = editingRow?.id === row.id;

              return (
                <tr
                  key={row.id}
                  className={isEditing ? styles.editingRow : undefined}
                >
                  <td className={styles.idCell}>{row.id}</td>

                  <td>
                    {isEditing ? (
                      <>
                        <input
                          className={styles.editInput}
                          value={editingRow.name}
                          onChange={(e) =>
                            setEditingRow(
                              (s) => s && { ...s, name: e.target.value }
                            )
                          }
                          placeholder="Name"
                          autoFocus
                        />
                        {!editingRow.name.trim() &&
                          editingRow.partner_name.trim() && (
                            <span className={styles.fieldError}>
                              Required when partner is set
                            </span>
                          )}
                      </>
                    ) : (
                      (row.name ?? <span className={styles.empty}>—</span>)
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className={styles.editInput}
                        value={editingRow.partner_name}
                        onChange={(e) =>
                          setEditingRow(
                            (s) => s && { ...s, partner_name: e.target.value }
                          )
                        }
                        placeholder="Partner's name"
                      />
                    ) : (
                      (row.partner_name ?? (
                        <span className={styles.empty}>—</span>
                      ))
                    )}
                  </td>

                  <td>
                    <span
                      className={`${styles.statusBadge} ${STATUS_CLASS[row.status] ?? ""}`}
                    >
                      {STATUS_LABELS[row.status] ?? row.status}
                    </span>
                  </td>

                  <td className={styles.dateCell}>
                    {new Date(row.created_at).toLocaleString("kk-KZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className={styles.actionsCell}>
                    {isEditing ? (
                      <div className={styles.editActions}>
                        {editError && (
                          <span className={styles.editError} title={editError}>
                            !
                          </span>
                        )}
                        <button
                          className={styles.saveBtn}
                          onClick={handleSaveEdit}
                          disabled={
                            isSaving || !!isUnchanged || hasPartnerWithoutName
                          }
                          title={
                            isUnchanged
                              ? "No changes"
                              : hasPartnerWithoutName
                                ? "Name required"
                                : "Save"
                          }
                        >
                          {isSaving ? "…" : "✓"}
                        </button>
                        <button
                          className={styles.cancelEditBtn}
                          onClick={cancelEditing}
                          disabled={isSaving}
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className={styles.editActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => startEditing(row)}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => openDeleteModal(row.id)}
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No RSVPs found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div ref={sentinelRef} className={styles.sentinel} />
        {loading && <div className={styles.loadingRow}>Жүктелуде…</div>}
        {error && <div className={styles.errorRow}>{error}</div>}
      </div>
    </div>
  );
}
