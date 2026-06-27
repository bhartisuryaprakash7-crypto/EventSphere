import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Live Events', value: '2', icon: '⚡', bgColor: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Registrations', value: '342', icon: '👥', bgColor: 'bg-indigo-50 text-indigo-600' },
    { label: 'Pending Approvals', value: '1', icon: '⏳', bgColor: 'bg-amber-50 text-amber-600' },
  ];

  const recentActivities = [
    { text: 'Amit Kumar registered for Hack-O-Sphere 2026', time: '2 mins ago' },
    { text: 'Priya Sharma requested certificate for Web3 Workshop', time: '1 hour ago' },
    { text: 'New event "Spandan Fest" sent to Faculty for approval', time: 'Yesterday' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight">Welcome Back, {user?.name || 'Organizer'}! 👋</h1>
          <p className="text-indigo-200 mt-2 max-w-xl text-sm">
            Manage your college events, track student participations, and generate analytics reports flawlessly from your central command panel.
          </p>
          <div className="mt-6 flex gap-4">
            <Link to="/organizer/create" className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition shadow-md">
              + Host New Event
            </Link>
          </div>
        </div>
        <div className="absolute right-8 bottom-0 text-9xl opacity-10 pointer-events-none hidden md:block">🎪</div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 mt-2">{stat.value}</p>
            </div>
            <div className={`text-2xl p-4 rounded-xl ${stat.bgColor} border border-slate-100 shadow-inner`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Live Activity Feed</h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {recentActivities.map((activity, idx) => (
              <li key={idx}>
                <div className="relative pb-8">
                  {idx !== recentActivities.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm ring-8 ring-white">
                        🔔
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{activity.text}</p>
                      </div>
                      <div className="text-right text-xs whitespace-nowrap text-slate-400 font-semibold uppercase">
                        <time>{activity.time}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;