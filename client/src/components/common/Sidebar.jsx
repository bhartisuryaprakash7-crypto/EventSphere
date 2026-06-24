import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Role ke mutabik links define karenge
  const menuItems = {
student: [
  { name: 'Dashboard', path: '/student/dashboard', icon: '📊' },
  { name: 'Browse Events', path: '/student/events', icon: '🎉' },
  { name: 'My Registrations', path: '/student/my-registrations', icon: '🎟️' }, // Add this
  { name: 'Certificates Vault', path: '/student/certificates', icon: '📜' },   // Add this
  { name: 'Submit Feedback', path: '/student/feedback', icon: '📝' },         // Add this
  { name: 'AI Chat Assistant', path: '/student/ai-chat', icon: '🧠' },
  { name: 'AI Feedback Summary', path: '/student/ai-feedback', icon: '📈' },
  { name: 'Smart Recommendations', path: '/student/ai-matches', icon: '🎯' },
],
    organizer: [
      { name: 'Dashboard', path: '/organizer/dashboard', icon: '📊' },
      { name: 'Create Event', path: '/organizer/create', icon: '➕' },
      { name: 'Manage Events', path: '/organizer/manage', icon: '⚙️' },
      { name: 'Attendance', path: '/organizer/attendance', icon: '👥' },
    ],
    // Aap faculty aur admin ke links bhi yahan add kar sakte hain...
    faculty: [
      { name: 'Dashboard', path: '/faculty/dashboard', icon: '📊' },
    { name: 'Approvals Queue', path: '/faculty/approval', icon: '📝' },
    { name: 'Campus Reports', path: '/faculty/reports', icon: '📊' },
  ],
admin: [
  { name: 'Admin Dashboard', path: '/admin/dashboard', icon: '🛠️' },
  { name: 'User Controls', path: '/admin/users', icon: '👥' },
  { name: 'Manage Venues', path: '/admin/venues', icon: '🏛️' },       // Add this
  { name: 'Departments', path: '/admin/departments', icon: '🏢' },    // Add this
  { name: 'System Reports', path: '/admin/reports', icon: '📄' },     // Add this
],
// Sidebar objects ke andar link blocks:
ai_links: [
  { name: 'AI Chat Core', path: '/ai/chat', icon: '🧠' },
  { name: 'Feedback Summary', path: '/ai/feedback', icon: '📊' },
  { name: 'Event Matches', path: '/ai/recommendations', icon: '🎯' },
],
  };

  const currentLinks = menuItems[role] || [];

  return (
    <div className="w-64 bg-slate-900 text-slate-100 h-screen flex flex-col justify-between shadow-xl">
      <div className="p-5">
        {/* Project Name */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🌐</span>
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            EventSphere
          </h2>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="space-y-2">
          {currentLinks.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-5 border-t border-slate-800">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 font-semibold py-3 px-4 rounded-xl transition"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;