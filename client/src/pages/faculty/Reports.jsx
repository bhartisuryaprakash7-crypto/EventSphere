import { useState } from 'react';

// Mock Data for Campus Wide Event Reports
const MOCK_REPORTS = [
  {
    id: 'REP-01',
    eventName: 'Hack-O-Sphere 2026',
    department: 'Computer Science',
    organizer: 'Rahul Sharma',
    totalRegistrations: 145,
    attendanceRate: '92%',
    status: 'Completed'
  },
  {
    id: 'REP-02',
    eventName: 'Spandan: Cultural Fest',
    department: 'Cultural Committee',
    organizer: 'Anjali Verma',
    totalRegistrations: 480,
    attendanceRate: '85%',
    status: 'Completed'
  },
  {
    id: 'REP-03',
    eventName: 'National E-Seminar',
    department: 'MBA / Commerce',
    organizer: 'Dr. Vivek Raj',
    totalRegistrations: 210,
    attendanceRate: '64%',
    status: 'Completed'
  },
  {
    id: 'REP-04',
    eventName: 'Robo-Soccer Challenge',
    department: 'Electronics & Robotics',
    organizer: 'Amit Reddy',
    totalRegistrations: 55,
    attendanceRate: '98%',
    status: 'Completed'
  }
];

const Reports = () => {
  const [reports] = useState(MOCK_REPORTS);
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Computer Science', 'Cultural Committee', 'MBA / Commerce', 'Electronics & Robotics'];

  // Filter logic based on department dropdown selection
  const filteredReports = reports.filter(report => 
    selectedDept === 'All' || report.department === selectedDept
  );

  const handleDownload = () => {
    alert('📥 PDF/Excel Report Downloading feature starting... (Backend API integration needed)');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campus Event Reports</h1>
          <p className="text-slate-500 mt-1">Analyze event performance, attendance statistics, and student participation.</p>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-600/10 transition active:scale-95 whitespace-nowrap"
        >
          📥 Download Executive Summary
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Filter by Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          >
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Quick Insights Counters */}
        <div className="flex gap-6 text-sm font-semibold text-slate-600 border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto justify-end">
          <div className="text-right">
            <span className="block text-xs font-bold uppercase text-slate-400">Total Events Done</span>
            <span className="text-xl font-black text-slate-800">{filteredReports.length}</span>
          </div>
          <div className="text-right border-l border-slate-200 pl-6">
            <span className="block text-xs font-bold uppercase text-slate-400">Total Footfall</span>
            <span className="text-xl font-black text-indigo-600">
              {filteredReports.reduce((sum, item) => sum + item.totalRegistrations, 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Reports Table Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Report ID</th>
                <th className="p-4">Event Name</th>
                <th className="p-4">Department / Domain</th>
                <th className="p-4 text-center">Registrations</th>
                <th className="p-4 text-center">Avg Attendance</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/40 transition">
                    <td className="p-4 font-mono font-bold text-slate-400 text-xs">{report.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-base">{report.eventName}</div>
                      <div className="text-xs text-slate-400 font-medium">Head Convener: {report.organizer}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-600">{report.department}</td>
                    <td className="p-4 text-center font-bold text-indigo-600">{report.totalRegistrations}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 font-bold rounded-lg ${
                        parseInt(report.attendanceRate) >= 85 ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
                      }`}>
                        {report.attendanceRate}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                        ✓ {report.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No reports match the selected department filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;