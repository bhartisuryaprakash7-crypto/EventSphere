import { useState } from 'react';

const INITIAL_USERS = [
  { id: 'U-01', name: 'Rahul CSE', email: 'rahul@college.edu', role: 'Organizer', status: 'Active' },
  { id: 'U-02', name: 'Amit Kumar', email: 'amit@student.edu', role: 'Student', status: 'Active' },
  { id: 'U-03', name: 'Dr. Vivek Raj', email: 'vivek@faculty.edu', role: 'Faculty', status: 'Active' },
  { id: 'U-04', name: 'Fake Account', email: 'spammer@bot.edu', role: 'Student', status: 'Blocked' },
];

const Users = () => {
  const [users, setUsers] = useState(INITIAL_USERS);

  const toggleStatus = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    if (window.confirm(`Kya aap ${name} ko ${nextStatus.toUpperCase()} karna chahte hain?`)) {
      setUsers(users.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Database Control</h1>
        <p className="text-slate-500 mt-1">Manage global permissions, lock/unlock student accounts instantly.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="p-4">User Details</th>
              <th className="p-4">Global Role</th>
              <th className="p-4">Security Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{u.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{u.email} [ID: {u.id}]</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase">
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    ● {u.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleStatus(u.id, u.name, u.status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      u.status === 'Active'
                        ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                        : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    {u.status === 'Active' ? '🛑 Block' : '🔓 Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;