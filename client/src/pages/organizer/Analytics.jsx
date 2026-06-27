import { useEffect, useState } from "react";
import api from "../../services/api";

// ─── Small helpers ────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
    <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-3xl font-black text-slate-800 leading-tight">{value ?? "—"}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const Bar = ({ label, value, max, color = "bg-indigo-600", extra }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-slate-700 truncate max-w-[60%]">{label}</span>
        <span className="text-xs font-bold text-slate-500">{extra ?? value}</span>
      </div>
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────
const Analytics = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // Try organizer-specific analytics first; fall back to general
        let res;
        try {
          res = await api.get("/analytics/organizer");
        } catch {
          res = await api.get("/analytics");
        }
        setData(res.data?.data ?? res.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
          "Analytics data load nahi ho saki. Backend se connection check karo."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 rounded-2xl h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-100 rounded-2xl h-64" />
          <div className="bg-slate-100 rounded-2xl h-64" />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Analytics</h1>
          <p className="text-slate-500 mt-1">Event-wise registrations aur attendance stats.</p>
        </div>
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

  // ── Derive display values safely ──
  const totalEvents        = data?.totalEvents        ?? data?.events?.total        ?? 0;
  const totalRegistrations = data?.totalRegistrations ?? data?.registrations?.total ?? 0;
  const totalAttendance    = data?.totalAttendance    ?? data?.attendance?.total     ?? 0;
  const pendingApprovals   = data?.pendingApprovals   ?? data?.events?.pending       ?? 0;

  // Event-wise list — try multiple possible shapes
  const eventWise = (
    data?.eventWise ??
    data?.eventStats ??
    data?.events?.list ??
    []
  );

  // Category breakdown
  const categories = (
    data?.categoryBreakdown ??
    data?.categories ??
    []
  );

  // Max values for bar scaling
  const maxReg = eventWise.reduce((m, e) => Math.max(m, e.registrations ?? e.registrationCount ?? 0), 1);
  const maxAtt = eventWise.reduce((m, e) => Math.max(m, e.attendance ?? e.attendanceCount ?? 0), 1);
  const maxCat = categories.reduce((m, c) => Math.max(m, c.count ?? c.total ?? 0), 1);

  const attendanceRate =
    totalRegistrations > 0
      ? Math.round((totalAttendance / totalRegistrations) * 100)
      : 0;

  const barColors = ["bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Analytics</h1>
          <p className="text-slate-500 mt-1">Event-wise registrations aur attendance stats.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="self-start sm:self-auto px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🎪" label="Total Events"         value={totalEvents}        color="bg-indigo-50 text-indigo-600" />
        <StatCard icon="👥" label="Total Registrations"  value={totalRegistrations} color="bg-violet-50 text-violet-600" />
        <StatCard icon="✅" label="Total Attendance"      value={totalAttendance}    color="bg-emerald-50 text-emerald-600" sub={`${attendanceRate}% attendance rate`} />
        <StatCard icon="⏳" label="Pending Approvals"    value={pendingApprovals}   color="bg-amber-50 text-amber-600" />
      </div>

      {/* ── Event-wise + Category ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Event-wise Registrations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-800">Registrations per Event</h3>
            <p className="text-xs text-slate-400 mt-0.5">Har event ke total registered students</p>
          </div>
          {eventWise.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">Koi event data nahi mila</p>
            </div>
          ) : (
            <div className="space-y-4">
              {eventWise.map((ev, i) => (
                <Bar
                  key={ev._id ?? i}
                  label={ev.title ?? ev.eventTitle ?? ev.name ?? `Event ${i + 1}`}
                  value={ev.registrations ?? ev.registrationCount ?? 0}
                  max={maxReg}
                  color={barColors[i % barColors.length]}
                  extra={`${ev.registrations ?? ev.registrationCount ?? 0} registered`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Event-wise Attendance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-800">Attendance per Event</h3>
            <p className="text-xs text-slate-400 mt-0.5">Kaun se event mein kitne students aaye</p>
          </div>
          {eventWise.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <p className="text-3xl mb-2">📊</p>
              <p className="text-sm">Attendance data abhi available nahi</p>
            </div>
          ) : (
            <div className="space-y-4">
              {eventWise.map((ev, i) => {
                const att = ev.attendance ?? ev.attendanceCount ?? 0;
                const reg = ev.registrations ?? ev.registrationCount ?? 1;
                const rate = Math.round((att / reg) * 100);
                return (
                  <Bar
                    key={ev._id ?? i}
                    label={ev.title ?? ev.eventTitle ?? ev.name ?? `Event ${i + 1}`}
                    value={att}
                    max={maxAtt}
                    color="bg-emerald-500"
                    extra={`${att} attended · ${rate}%`}
                  />
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ── Category Breakdown ── */}
      {categories.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-800">Category Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Kaunsi category mein kitne events hue</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <Bar
                key={cat._id ?? cat.category ?? i}
                label={cat._id ?? cat.category ?? `Category ${i + 1}`}
                value={cat.count ?? cat.total ?? 0}
                max={maxCat}
                color={barColors[i % barColors.length]}
                extra={`${cat.count ?? cat.total ?? 0} events`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Raw fallback: if backend sends unknown shape ── */}
      {eventWise.length === 0 && categories.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">📈</p>
          <h4 className="font-bold text-slate-700">Data mil gaya par charts ke liye format match nahi hua</h4>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Backend se jo response aaya uska structure thoda alag hai. Developer ko
            <code className="bg-slate-200 px-1 rounded text-xs mx-1">eventWise</code>
            ya <code className="bg-slate-200 px-1 rounded text-xs">categoryBreakdown</code> array add karne ko bolo.
          </p>
        </div>
      )}

    </div>
  );
};

export default Analytics;