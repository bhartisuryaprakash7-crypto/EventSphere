import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const globalStats = [
    { label: 'Total Users Connected', value: '1,245', icon: '👥', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Total Events Hosted', value: '48', icon: '🎉', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Venues Booked', value: '8/12', icon: '🏛️', color: 'text-amber-600 bg-amber-50' },
    { label: 'System Health', value: '100%', icon: '⚙️', color: 'text-cyan-600 bg-cyan-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-black tracking-tight">Root Admin Command Center 🛠️</h1>
        <p className="text-red-200 mt-2 max-w-xl text-sm">
          Hello {user?.name || 'Administrator'}. You have full read, write, and execute permissions across all university databases and servers.
        </p>
      </div>

      {/* Global Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 mt-2">{stat.value}</p>
            </div>
            <div className={`text-2xl p-3.5 rounded-xl ${stat.color} shadow-inner`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">🚨 Critical System Logs</h3>
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium rounded-xl">
          ⚠️ Notice: Cloud server backup sequence completed at 03:00 AM. 0 pending security flags reported.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;