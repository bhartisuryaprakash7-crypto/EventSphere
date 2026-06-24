import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  // Quick Metrics for Faculty
  const facultyStats = [
    { label: 'Pending Requests', value: '2', icon: '⏳', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Approved Events (This Month)', value: '12', icon: '✅', color: 'bg-green-50 text-green-600 border-green-100' },
    { label: 'Total Active Venues', value: '5', icon: '🏛️', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  ];

  // Recent Requests Preview Data
  const pendingPreviews = [
    { id: 'EV-901', title: 'Hack-O-Sphere 2026', organizer: 'Rahul (CSE Dept.)', date: 'July 15, 2026' },
    { id: 'EV-902', title: 'Spandan: Cultural Fest', organizer: 'Anjali (Cultural Club)', date: 'August 02, 2026' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Notice Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight">Welcome, Professor {user?.name || 'Authority'} 🎓</h1>
          <p className="text-slate-300 mt-2 max-w-xl text-sm">
            Review and clear pending event requests, inspect department allocation logs, and view executive summaries of completed college activities.
          </p>
        </div>
        <div className="absolute right-12 bottom-[-20px] text-9xl opacity-5 pointer-events-none hidden md:block">🏛️</div>
      </div>

      {/* Faculty Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facultyStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 mt-2">{stat.value}</p>
            </div>
            <div className={`text-2xl p-4 rounded-xl border ${stat.color} shadow-inner`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action & Action Needed Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Pending Approval Requests Preview Card (Takes 2 Columns) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-800">Pending Approvals Queue</h3>
            <Link to="/faculty/approval" className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-wider">
              View Full Queue →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingPreviews.map((req) => (
              <div key={req.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div>
                  <h4 className="font-bold text-slate-700 text-base">{req.title}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    By {req.organizer} • Date: <span className="text-slate-500 font-semibold">{req.date}</span>
                  </p>
                </div>
                <Link 
                  to="/faculty/approval" 
                  className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Reference Guidelines (Takes 1 Column) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Approval Guidelines</h3>
          <ul className="space-y-3 text-xs font-medium text-slate-500 list-disc pl-4 leading-relaxed">
            <li>Verify venue clash reports before checking the "Approve" button.</li>
            <li>Ensure the expected capacity matches standard structural safety policies.</li>
            <li>Always attach logical rejection logs if sending requests back to organizers.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;