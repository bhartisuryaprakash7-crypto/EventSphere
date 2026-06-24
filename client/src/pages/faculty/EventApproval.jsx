import { useState } from 'react';

const MOCK_PENDING_EVENTS = [
  {
    id: 'EV-901',
    title: 'Hack-O-Sphere 2026',
    organizer: 'Rahul (Computer Science Dept.)',
    date: '2026-07-15',
    venue: 'Main Seminar Hall',
    capacity: 150,
    description: 'A 24-hour state-level hackathon focused on solving real-world problems using AI and Web3 technologies.',
    status: 'Pending'
  },
  {
    id: 'EV-902',
    title: 'Spandan: Cultural Fest',
    organizer: 'Anjali (Cultural Committee)',
    date: '2026-08-02',
    venue: 'Open Air Theater (OAT)',
    capacity: 500,
    description: 'Annual cultural gathering including rock band performances, classical dance, and drama competitions.',
    status: 'Pending'
  }
];

const EventApproval = () => {
  const [events, setEvents] = useState(MOCK_PENDING_EVENTS);

  // Handle Approve Action
  const handleApprove = (id, title) => {
    alert(`✅ "${title}" ko successfully APPROVE kar diya gaya hai.`);
    setEvents(events.filter(event => event.id !== id));
  };

  // Handle Reject Action
  const handleReject = (id, title) => {
    const reason = window.prompt(`"${title}" ko REJECT karne ka kaaran (Reason) likhein:`);
    if (reason !== null) {
      alert(`❌ Event reject ho gaya. Reason: ${reason || 'No reason specified'}`);
      setEvents(events.filter(event => event.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Approvals</h1>
        <p className="text-slate-500 mt-1">Review, approve, or reject upcoming campus event requests.</p>
      </div>

      {/* Main Content Area */}
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col lg:flex-row justify-between gap-6 hover:border-slate-300 transition-all"
            >
              {/* Left Side: Event Details */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {event.id}
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    ⏱ {event.status} Approval
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                <p className="text-xs text-slate-400 font-medium">Requested by: <span className="text-slate-600 font-semibold">{event.organizer}</span></p>
                
                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {event.description}
                </p>

                {/* Quick Meta Data Grid */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 pt-2">
                  <div className="flex items-center gap-1.5">📅 <span>Date: {event.date}</span></div>
                  <div className="flex items-center gap-1.5">📍 <span>Venue: {event.venue}</span></div>
                  <div className="flex items-center gap-1.5">👥 <span>Expected Seats: {event.capacity}</span></div>
                </div>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="flex lg:flex-col justify-end items-end gap-3 self-center w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <button
                  onClick={() => handleApprove(event.id, event.title)}
                  className="w-full lg:w-32 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg shadow-green-600/10 transition active:scale-95"
                >
                  Approve ✓
                </button>
                <button
                  onClick={() => handleReject(event.id, event.title)}
                  className="w-full lg:w-32 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition active:scale-95"
                >
                  Reject ✗
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-5xl">🎉</span>
          <h3 className="text-lg font-bold text-slate-800 mt-4">All Caught Up!</h3>
          <p className="text-slate-400 text-sm mt-1">No pending event approval requests at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default EventApproval;
