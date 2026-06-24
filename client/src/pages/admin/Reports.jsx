import { useState } from 'react';

const Reports = () => {
  const [logs] = useState([
    { id: 'LOG-881', event: 'Hack-O-Sphere 2026', type: 'Technical', systemStatus: 'Database Synced', date: '2026-06-23' },
    { id: 'LOG-882', event: 'Spandan Cultural Fest', type: 'Cultural', systemStatus: 'Tickets Active', date: '2026-06-22' },
    { id: 'LOG-883', event: 'Web3 BootCamp', type: 'Workshop', systemStatus: 'Archived', date: '2026-06-15' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Audit Reports</h1>
          <p className="text-slate-500 mt-1">System-wide core ledger logs and database backup logs.</p>
        </div>
        <button onClick={() => alert('Exporting Master Database Logs...')} className="bg-slate-900 text-white text-xs font-bold uppercase px-4 py-2.5 rounded-xl hover:bg-slate-800 transition">
          📄 Export Master Log CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="p-4">Audit ID</th>
              <th className="p-4">Target Activity</th>
              <th className="p-4">Classification</th>
              <th className="p-4">Timestamp</th>
              <th className="p-4 text-right">Engine Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/40 transition">
                <td className="p-4 font-mono font-bold text-xs text-slate-400">{log.id}</td>
                <td className="p-4 font-bold text-slate-800">{log.event}</td>
                <td className="p-4 font-medium text-slate-500">{log.type}</td>
                <td className="p-4 text-slate-400 font-medium">{log.date}</td>
                <td className="p-4 text-right">
                  <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">
                    {log.systemStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;