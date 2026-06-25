import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Mock events — baad mein API se replace karna
const ORGANIZER_EVENTS = [
  { id: '65c8a1b2e4b0f2a1c8f90123', title: 'Hack-O-Sphere 2026' },
  { id: '65c8a1b2e4b0f2a1c8f90124', title: 'Spandan: Cultural Fest' },
  { id: '65c8a1b2e4b0f2a1c8f90125', title: 'AI & ML Workshop' },
];

const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showEventPicker, setShowEventPicker] = useState(false);

  const menuItems = {
    student: [
      { name: 'Dashboard',             path: '/student/dashboard',        icon: '📊' },
      { name: 'Browse Events',         path: '/student/events',           icon: '🎉' },
      { name: 'My Registrations',      path: '/student/my-registrations', icon: '🎟️' },
      { name: 'Certificates Vault',    path: '/student/certificates',     icon: '📜' },
      { name: 'Submit Feedback',       path: '/student/feedback',         icon: '📝' },
      { name: 'AI Chat Assistant',     path: '/student/ai-chat',          icon: '🧠' },
      { name: 'AI Feedback Summary',   path: '/student/ai-feedback',      icon: '📈' },
      { name: 'Smart Recommendations', path: '/student/ai-matches',       icon: '🎯' },
    ],
    organizer: [
      { name: 'Dashboard',     path: '/organizer/dashboard', icon: '📊' },
      { name: 'Create Event',  path: '/organizer/create',    icon: '➕' },
      { name: 'Manage Events', path: '/organizer/manage',    icon: '⚙️' },
      { name: 'Analytics',     path: '/organizer/analytics', icon: '📈' },
      // Attendance ke liye special entry — picker open karega
      { name: 'Attendance',    path: '/organizer/attendance', icon: '👥', isPicker: true },
    ],
    faculty: [
      { name: 'Dashboard',       path: '/faculty/dashboard', icon: '📊' },
      { name: 'Approvals Queue', path: '/faculty/approval',  icon: '📝' },
      { name: 'Campus Reports',  path: '/faculty/reports',   icon: '📊' },
    ],
    admin: [
      { name: 'Admin Dashboard', path: '/admin/dashboard',   icon: '🛠️' },
      { name: 'User Controls',   path: '/admin/users',       icon: '👥' },
      { name: 'Manage Venues',   path: '/admin/venues',      icon: '🏛️' },
      { name: 'Departments',     path: '/admin/departments', icon: '🏢' },
      { name: 'System Reports',  path: '/admin/reports',     icon: '📄' },
    ],
  };

  const currentLinks = menuItems[role] || [];

  const isAttendanceActive = location.pathname.startsWith('/organizer/attendance');

  return (
    <div className="w-64 bg-slate-900 text-slate-100 h-screen flex flex-col justify-between shadow-xl relative">
      <div className="p-5">
        {/* Project Name */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🌐</span>
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            EventSphere
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {currentLinks.map((item, index) => {
            // Attendance ke liye special handling
            if (item.isPicker) {
              return (
                <div key={index}>
                  <button
                    onClick={() => setShowEventPicker((prev) => !prev)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
                      isAttendanceActive || showEventPicker
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1 text-left">{item.name}</span>
                    <span className="text-xs">{showEventPicker ? '▲' : '▼'}</span>
                  </button>

                  {/* Event Picker Dropdown */}
                  {showEventPicker && (
                    <div className="mt-1 ml-4 space-y-1">
                      {ORGANIZER_EVENTS.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => {
                            setShowEventPicker(false);
                            navigate(`/organizer/attendance/${event.id}`);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            location.pathname === `/organizer/attendance/${event.id}`
                              ? 'bg-indigo-500 text-white'
                              : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          🎯 {event.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Normal links
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
