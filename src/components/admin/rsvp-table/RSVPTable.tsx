import { useState, useEffect, useRef } from "react";
import config from "@/config";
import type { RSVPInDB } from "@/components/rsvp/RSVP.shema";
import ConfirmDelete from "@/components/admin/rsvp-table/ConfirmDelete";
import styles from "@/components/admin/rsvp-table/RSVPTable.module.css";
import { getDefaultDates } from "@/utils/date";
import type { PaginatedRSVP } from "@/components/admin/rsvp-table/RSVPTable.schema";
import { PaginatedRSVPSchema } from "@/components/admin/rsvp-table/RSVPTable.schema";

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
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error();

      setRows((prev) => prev.filter((r) => r.id !== deleteTargetId));
      setTotal((t) => t - 1);
      setDeleteTargetId(null); // Close modal
    } catch {
      alert("Failed to delete RSVP");
    } finally {
      setIsDeleting(false);
    }
  }

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
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={styles.idCell}>{row.id}</td>
                <td>{row.name ?? <span className={styles.empty}>—</span>}</td>
                <td>
                  {row.partner_name ?? <span className={styles.empty}>—</span>}
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
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => openDeleteModal(row.id)} // Changed this
                    title="Delete"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
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
