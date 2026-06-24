import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock Data for Managed Events
const INITIAL_MANAGED_EVENTS = [
  {
    id: 1,
    title: 'Hack-O-Sphere 2026',
    category: 'Technical',
    date: '2026-07-15',
    venue: 'Main Seminar Hall',
    registrations: 120,
    capacity: 150,
    status: 'Active',
  },
  {
    id: 2,
    title: 'Spandan: Cultural Fest',
    category: 'Cultural',
    date: '2026-08-02',
    venue: 'Open Air Theater (OAT)',
    registrations: 180,
    capacity: 200,
    status: 'Upcoming',
  },
  {
    id: 3,
    title: 'AI & ML Workshop',
    category: 'Workshop',
    date: '2026-05-10',
    venue: 'Lab 3, IT Block',
    registrations: 60,
    capacity: 60,
    status: 'Completed',
  },
];

const ManageEvents = () => {
  const [events, setEvents] = useState(INITIAL_MANAGED_EVENTS);

  // Delete Event Handler
  const handleDelete = (id, title) => {
    if (window.confirm(`Kya aap sach mein "${title}" event ko delete karna chahte hain?`)) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  // Status Color Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Events</h1>
          <p className="text-slate-500 mt-1">Edit, delete, and monitor all the events hosted by you.</p>
        </div>
        <Link
          to="/organizer/create"
          className="inline-flex items-center justify-center bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition active:scale-95 whitespace-nowrap"
        >
          + Create New Event
        </Link>
      </div>

      {/* Events Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Event Details</th>
                <th className="p-4">Date & Venue</th>
                <th className="p-4">Registrations</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/40 transition">
                    {/* Title & Category */}
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-base">{event.title}</div>
                      <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1">
                        {event.category}
                      </span>
                    </td>

                    {/* Date & Venue */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <span>📅</span> {event.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <span>📍</span> {event.venue}
                      </div>
                    </td>

                    {/* Registrations Progress */}
                    <td className="p-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>{event.registrations} / {event.capacity} Seats</span>
                      </div>
                      <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(event.status)}`}>
                        ● {event.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => alert(`Editing features for "${event.title}" coming soon!`)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                        title="Edit Event"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Delete Event"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No events found. Click "+ Create New Event" to get started!
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

export default ManageEvents;