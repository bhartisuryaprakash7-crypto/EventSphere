import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyEvents, deleteEvent } from "../../services/eventService";

const STATUS_STYLES = {
  approved:  "bg-emerald-100 text-emerald-700",
  active:    "bg-emerald-100 text-emerald-700",
  pending:   "bg-amber-100  text-amber-700",
  rejected:  "bg-red-100    text-red-700",
  completed: "bg-slate-100  text-slate-600",
  upcoming:  "bg-blue-100   text-blue-700",
};

const getStatusStyle = (status = "") =>
  STATUS_STYLES[status.toLowerCase()] ?? "bg-slate-100 text-slate-600";

const getStatusDot = (status = "") => {
  const s = status.toLowerCase();
  if (s === "approved" || s === "active")  return "text-emerald-500";
  if (s === "pending")                     return "text-amber-500";
  if (s === "rejected")                    return "text-red-500";
  return "text-slate-400";
};

// ─── Main Component ───────────────────────────────────────────
const ManageEvents = () => {
  const navigate = useNavigate();

  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [deleting, setDeleting] = useState(null); // id being deleted
  const [filter,  setFilter]  = useState("all");  // "all" | "approved" | "pending" | "completed"

  // ── Fetch my events ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getMyEvents();
        // Support { data: [...] } or direct array
        const list = res.data?.data ?? res.data ?? [];
        setEvents(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
          "Events load nahi ho sake. Backend check karo."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Delete ──
  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" event delete karna chahte ho?`)) return;
    try {
      setDeleting(id);
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => (e._id ?? e.id) !== id));
    } catch (err) {
      alert(err.response?.data?.message ?? "Delete nahi ho saka.");
    } finally {
      setDeleting(null);
    }
  };

  // ── Navigate to attendance ──
  const handleAttendance = (id) => navigate(`/organizer/attendance/${id}`);

  // ── Filter ──
  const filtered = events.filter((e) => {
    if (filter === "all") return true;
    return (e.status ?? "").toLowerCase() === filter;
  });

  // ── Counts for filter tabs ──
  const counts = {
    all:       events.length,
    approved:  events.filter((e) => ["approved","active"].includes((e.status ?? "").toLowerCase())).length,
    pending:   events.filter((e) => (e.status ?? "").toLowerCase() === "pending").length,
    completed: events.filter((e) => (e.status ?? "").toLowerCase() === "completed").length,
  };

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-56" />
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-b border-slate-100 flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
              <div className="h-5 bg-slate-100 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Events</h1>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-bold text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Manage Events</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Aapke saare events — edit, attendance, delete.
          </p>
        </div>
        <Link
          to="/organizer/create"
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition active:scale-95 whitespace-nowrap"
        >
          + Create New Event
        </Link>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all",       label: "All"       },
          { key: "approved",  label: "Approved"  },
          { key: "pending",   label: "Pending"   },
          { key: "completed", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition
              ${filter === tab.key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-400"
              }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
              ${filter === tab.key ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"}`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3 hidden sm:table-cell">Date & Venue</th>
                <th className="px-4 py-3 hidden md:table-cell">Registrations</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-medium text-sm">
                      {filter === "all"
                        ? 'Koi event nahi mila. "+ Create New Event" pe click karo.'
                        : `Koi "${filter}" event nahi hai.`}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((event) => {
                  const id  = event._id ?? event.id;
                  const reg = event.registrations ?? event.registrationCount ?? 0;
                  const cap = event.capacity ?? 0;
                  const pct = cap > 0 ? Math.round((reg / cap) * 100) : 0;
                  const isDeleting = deleting === id;

                  return (
                    <tr key={id} className={`hover:bg-slate-50/60 transition ${isDeleting ? "opacity-40" : ""}`}>

                      {/* Event title + category */}
                      <td className="px-4 py-4 max-w-[200px]">
                        <p className="font-bold text-slate-800 truncate">{event.title}</p>
                        <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1">
                          {event.category}
                        </span>
                      </td>

                      {/* Date & venue */}
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs">
                          📅 {event.date ? new Date(event.date).toLocaleDateString("en-IN") : "—"}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                          📍 {event.venue ?? "—"}
                        </div>
                      </td>

                      {/* Registrations bar */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-xs font-bold text-slate-500 mb-1">
                          {reg} / {cap} seats
                        </p>
                        <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-red-500" : "bg-indigo-500"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        {pct >= 100 && (
                          <p className="text-xs text-red-500 font-semibold mt-0.5">Full</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(event.status)}`}>
                          <span className={`mr-1 ${getStatusDot(event.status)}`}>●</span>
                          {event.status ?? "Unknown"}
                        </span>
                        {/* Show rejection reason if rejected */}
                        {(event.status ?? "").toLowerCase() === "rejected" && event.rejectionReason && (
                          <p className="text-xs text-red-400 mt-1 max-w-[120px] truncate" title={event.rejectionReason}>
                            Reason: {event.rejectionReason}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right whitespace-nowrap">

                        {/* Attendance — only for approved/active events */}
                        {["approved", "active"].includes((event.status ?? "").toLowerCase()) && (
                          <button
                            onClick={() => handleAttendance(id)}
                            title="Mark Attendance"
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                          >
                            👥
                          </button>
                        )}

                        <button
                          onClick={() => alert(`Edit feature jaldi aa raha hai!`)}
                          title="Edit Event"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => handleDelete(id, event.title)}
                          title="Delete Event"
                          disabled={isDeleting}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-40"
                        >
                          {isDeleting ? "⏳" : "🗑️"}
                        </button>

                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageEvents;