import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// ─── Skeleton loader ──────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

// ─── Main Component ───────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats]       = useState(null);
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Organizer ke events + analytics ek saath
        const [eventsRes, analyticsRes] = await Promise.allSettled([
          api.get('/events/mine'),
          api.get('/analytics/organizer'),
        ]);

        // Events
        let myEvents = [];
        if (eventsRes.status === 'fulfilled') {
          const d = eventsRes.value.data;
          myEvents = d?.data ?? d ?? [];
          setEvents(Array.isArray(myEvents) ? myEvents : []);
        }

        // Analytics stats
        if (analyticsRes.status === 'fulfilled') {
          const d = analyticsRes.value.data;
          setStats(d?.data ?? d);
        } else {
          // Fallback: derive from events list if analytics fails
          const pending   = myEvents.filter(e => e.status === 'pending').length;
          const approved  = myEvents.filter(e => e.status === 'approved').length;
          setStats({
            totalEvents:        myEvents.length,
            totalRegistrations: 0,
            totalAttendance:    0,
            pendingApprovals:   pending,
            liveEvents:         approved,
          });
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ── Derived values ──
  const liveEvents     = stats?.liveEvents     ?? events.filter(e => e.status === 'approved').length;
  const pendingCount   = stats?.pendingApprovals ?? events.filter(e => e.status === 'pending').length;
  const totalRegs      = stats?.totalRegistrations ?? 0;
  const totalAtt       = stats?.totalAttendance    ?? 0;
  const attRate        = totalRegs > 0 ? Math.round((totalAtt / totalRegs) * 100) : 0;

  // Recent 5 events as activity feed
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statusLabel = (status) => {
    const map = {
      pending:   { text: 'Faculty approval ka wait kar raha hai', icon: '⏳' },
      approved:  { text: 'Faculty ne approve kar diya — live hai!', icon: '✅' },
      rejected:  { text: 'Faculty ne reject kar diya', icon: '❌' },
      completed: { text: 'Event complete ho gaya', icon: '🏁' },
    };
    return map[status?.toLowerCase()] ?? { text: status, icon: '📌' };
  };

  const timeAgo = (date) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return 'Abhi abhi';
    if (mins < 60)  return `${mins} min pehle`;
    if (hours < 24) return `${hours} ghante pehle`;
    return `${days} din pehle`;
  };

  return (
    <div className="space-y-8">

      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight">
            Welcome Back, {user?.name || 'Organizer'}! 👋
          </h1>
          <p className="text-indigo-200 mt-2 max-w-xl text-sm">
            Apne events manage karo, student participation track karo, aur analytics dekho — sab ek jagah.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/organizer/create"
              className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition shadow-md"
            >
              + Host New Event
            </Link>
            <Link
              to="/organizer/manage"
              className="bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-600 transition"
            >
              Manage Events
            </Link>
          </div>
        </div>
        <div className="absolute right-8 bottom-0 text-9xl opacity-10 pointer-events-none hidden md:block">🎪</div>
      </div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <Skeleton className="h-3 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Events</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{liveEvents}</p>
              </div>
              <div className="text-2xl p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-slate-100">⚡</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registrations</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{totalRegs}</p>
              </div>
              <div className="text-2xl p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-slate-100">👥</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{pendingCount}</p>
                {pendingCount > 0 && (
                  <p className="text-xs text-amber-500 font-semibold mt-0.5">Faculty se approval baaki</p>
                )}
              </div>
              <div className="text-2xl p-3 rounded-xl bg-amber-50 text-amber-600 border border-slate-100">⏳</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{attRate}%</p>
                <p className="text-xs text-slate-400 mt-0.5">{totalAtt} present / {totalRegs} registered</p>
              </div>
              <div className="text-2xl p-3 rounded-xl bg-violet-50 text-violet-600 border border-slate-100">✅</div>
            </div>
          </>
        )}

      </div>

      {/* ── Bottom Grid: My Events + Activity Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* My Events Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-800">My Events</h3>
            <Link to="/organizer/manage" className="text-xs font-semibold text-indigo-600 hover:underline">
              Sab dekho →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm font-medium">Koi event nahi hai abhi</p>
              <Link to="/organizer/create" className="mt-3 inline-block text-xs font-bold text-indigo-600 hover:underline">
                + Pehla event create karo
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((ev) => {
                const id  = ev._id ?? ev.id;
                const { text, icon } = statusLabel(ev.status);
                return (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition border border-slate-100">
                    <div className="text-xl">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{ev.title}</p>
                      <p className="text-xs text-slate-400">{text}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0
                      ${ev.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        ev.status === 'pending'  ? 'bg-amber-100 text-amber-700' :
                        ev.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'}`}>
                      {ev.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-800 mb-5">Recent Activity</h3>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <p className="text-3xl mb-2">🔔</p>
              <p className="text-sm">Koi activity nahi abhi</p>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-mb-6">
                {recentEvents.map((ev, idx) => (
                  <li key={ev._id ?? idx}>
                    <div className="relative pb-6">
                      {idx !== recentEvents.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" />
                      )}
                      <div className="relative flex gap-3">
                        <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm ring-4 ring-white flex-shrink-0">
                          🔔
                        </span>
                        <div className="flex-1 min-w-0 pt-1 flex justify-between gap-2">
                          <p className="text-sm text-slate-700">
                            <span className="font-bold">{ev.title}</span>
                            {' '}event{' '}
                            <span className={`font-semibold ${
                              ev.status === 'approved' ? 'text-emerald-600' :
                              ev.status === 'pending'  ? 'text-amber-600'  :
                              ev.status === 'rejected' ? 'text-red-600'    : 'text-slate-600'
                            }`}>
                              {ev.status}
                            </span>
                            {' '}hai
                          </p>
                          <time className="text-xs text-slate-400 font-semibold whitespace-nowrap uppercase">
                            {timeAgo(ev.createdAt)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;