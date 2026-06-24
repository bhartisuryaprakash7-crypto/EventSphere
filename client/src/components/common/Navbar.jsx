import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 py-4 flex justify-between items-center">
      {/* Search Bar Placeholder */}
      <div className="text-sm text-slate-400 font-medium hidden md:block">
        Dashboard Overview
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-600"></span>
          🔔
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{user?.name || 'User'}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {user?.role}
            </p>
          </div>
          {/* Avatar Placeholder */}
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {user?.name ? user.name[0] : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;