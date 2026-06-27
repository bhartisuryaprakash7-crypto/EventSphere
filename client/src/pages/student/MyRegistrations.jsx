// pages/student/MyRegistrations.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyRegistrations, cancelRegistration } from "../../services/eventService";
import toast from "react-hot-toast";

const statusConfig = {
  Upcoming: { cls: "bg-indigo-50 text-indigo-600 border-indigo-100", dot: "bg-indigo-500", label: "Upcoming" },
  Attended: { cls: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500", label: "Attended" },
  Absent:   { cls: "bg-rose-50   text-rose-600   border-rose-100",   dot: "bg-rose-500",   label: "Absent"   },
  Live:     { cls: "bg-amber-50  text-amber-600  border-amber-100",  dot: "bg-amber-500",  label: "Live Now" },
};

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [cancellingId, setCancellingId]   = useState(null);
  const [filterStatus, setFilterStatus]   = useState("All");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await getMyRegistrations();
      setRegistrations(res.data);
    } catch (err) {
      toast.error("Could not fetch registrations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId, eventName) => {
    if (!window.confirm(`Cancel registration for "${eventName}"?`)) return;
    setCancellingId(eventId);
    try {
      await cancelRegistration(eventId);
      toast.success("Registration cancelled.");
      setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel. Try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const statuses = ["All", "Upcoming", "Attended", "Absent"];
  const filtered = filterStatus === "All"
    ? registrations
    : registrations.filter((r) => r.status === filterStatus);

  // Summary stats
  const stats = {
    total:    registrations.length,
    upcoming: registrations.filter((r) => r.status === "Upcoming").length,
    attended: registrations.filter((r) => r.status === "Attended").length,
    absent:   registrations.filter((r) => r.status === "Absent").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Registered Events</h1>
        <p className="text-slate-500 mt-1 text-sm">Track your passes, schedules, and attendance history.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Passes", value: stats.total,    color: "bg-slate-900 text-white" },
          { label: "Upcoming",     value: stats.upcoming, color: "bg-indigo-50 text-indigo-700" },
          { label: "Attended",     value: stats.attended, color: "bg-emerald-50 text-emerald-700" },
          { label: "Absent",       value: stats.absent,   color: "bg-rose-50 text-rose-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-slate-100`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide mt-0.5 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full border transition ${
              filterStatus === s
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-slate-100 rounded" />
                <div className="h-3 w-1/3 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Ticket ID</th>
                  <th className="px-5 py-3.5">Event</th>
                  <th className="px-5 py-3.5">Date & Venue</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">QR Pass</th>
                  <th className="px-5 py-3.5">Certificate</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filtered.map((reg) => {
                  const sc = statusConfig[reg.status] || statusConfig.Upcoming;
                  return (
                    <tr key={reg._id} className="hover:bg-slate-50/50 transition">
                      {/* Ticket ID */}
                      <td className="px-5 py-4 font-mono font-bold text-slate-400 text-xs whitespace-nowrap">
                        {reg.ticketId || `REG-${reg._id?.slice(-4).toUpperCase()}`}
                      </td>

                      {/* Event name */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800">{reg.event?.title || reg.eventName}</p>
                        <p className="text-xs text-slate-400">by {reg.event?.organizer?.name || "—"}</p>
                      </td>

                      {/* Date & Venue */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-600 whitespace-nowrap">
                          {reg.event?.date
                            ? new Date(reg.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : reg.date}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">📍 {reg.event?.venue || reg.venue || "—"}</p>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                          {reg.event?.category || reg.category || "General"}
                        </span>
                      </td>

                      {/* QR Pass */}
                      <td className="px-5 py-4">
                        <Link
                          to={`/student/qr/${reg.event?._id || reg.eventId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
                        >
                          📲 QR Pass
                        </Link>
                      </td>

                      {/* Certificate — only if attended */}
                      <td className="px-5 py-4">
                        {reg.status === "Attended" && reg.certificateId ? (
                          <Link
                            to={`/student/certificates`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                          >
                            🏅 View Cert
                          </Link>
                        ) : reg.status === "Attended" ? (
                          <span className="text-xs text-amber-500 font-semibold">⏳ Generating…</span>
                        ) : (
                          <span className="text-xs text-slate-300 font-medium">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>

                      {/* Cancel (only for upcoming) */}
                      <td className="px-5 py-4">
                        {reg.status === "Upcoming" && (
                          <button
                            onClick={() => handleCancel(reg.event?._id || reg.eventId, reg.event?.title || reg.eventName)}
                            disabled={cancellingId === (reg.event?._id || reg.eventId)}
                            className="text-xs text-rose-400 hover:text-rose-600 font-semibold transition disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <span className="text-5xl">🎫</span>
          <h3 className="text-xl font-black text-slate-700 mt-4">No Registrations Found</h3>
          <p className="text-slate-400 text-sm mt-2">
            {filterStatus !== "All" ? `No ${filterStatus} events.` : "Browse events and register to get started!"}
          </p>
          <Link
            to="/student/browse"
            className="inline-block mt-5 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition"
          >
            Browse Events →
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;