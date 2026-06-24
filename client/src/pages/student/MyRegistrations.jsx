import { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_REGISTRATIONS = [
  {
    id: 'REG-901',
    eventId: 'event1',
    eventName: 'Hack-O-Sphere 2026',
    date: 'July 15, 2026',
    venue: 'Main Auditorium',
    status: 'Upcoming',
    type: 'Technical'
  },
  {
    id: 'REG-702',
    eventId: 'event2',
    eventName: 'Web3 BootCamp',
    date: 'June 10, 2026',
    venue: 'Lab 3 (IT Block)',
    status: 'Attended',
    type: 'Workshop'
  },
  {
    id: 'REG-405',
    eventId: 'event3',
    eventName: 'Spandan Cultural Fest',
    date: 'May 02, 2026',
    venue: 'Open Air Theater',
    status: 'Absent',
    type: 'Cultural'
  }
];

const MyRegistrations = () => {
  const [registrations] = useState(MOCK_REGISTRATIONS);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          My Registered Events
        </h1>
        <p className="text-slate-500 mt-1">
          Track your pass status, venue locations, and schedule timings.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Event Name</th>
                <th className="p-4">Date & Venue</th>
                <th className="p-4">Category</th>
                <th className="p-4">QR Pass</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">

              {registrations.map((reg) => (

                <tr
                  key={reg.id}
                  className="hover:bg-slate-50/40 transition"
                >
                  <td className="p-4 font-mono font-bold text-slate-400 text-xs">
                    {reg.id}
                  </td>

                  <td className="p-4 font-bold text-slate-800 text-base">
                    {reg.eventName}
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-slate-600">
                      {reg.date}
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                      📍 {reg.venue}
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                      {reg.type}
                    </span>
                  </td>

                  <td className="p-4">
                    <Link
                      to={`/student/qr/${reg.eventId}`}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      Show QR
                    </Link>
                  </td>

                  <td className="p-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        reg.status === 'Upcoming'
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                          : reg.status === 'Attended'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default MyRegistrations;