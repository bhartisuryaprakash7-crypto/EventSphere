import { useEffect, useState } from "react";
import {
  getPendingEvents,
  approveEvent,
  rejectEvent,
} from "../../services/eventService";

const EventApproval = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getPendingEvents();
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveEvent(id);
      alert("✅ Event Approved Successfully");
      fetchEvents();
    } catch (err) {
      console.log(err);
      alert("❌ Approval Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectEvent(id);
      alert("❌ Event Rejected"); 
      fetchEvents();
    } catch (err) {
      console.log(err);
      alert("❌ Reject Failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Event Approvals
        </h1>
        <p className="text-slate-500 mt-1">
          Review, approve, or reject upcoming campus event requests.
        </p>
      </div>

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col lg:flex-row justify-between gap-6 hover:border-slate-300 transition-all"
            >
              {/* Event Details */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {event._id?.slice(-6)}
                  </span>

                  <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    ⏱ Pending Approval
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800">
                  {event.title}
                </h3>

                <p className="text-xs text-slate-400 font-medium">
                  Requested by:
                  <span className="text-slate-600 font-semibold ml-1">
                    {event.organizer?.name || "Organizer"}
                  </span>
                </p>

                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    📅 <span>{event.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    📍 <span>{event.venue}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    👥 <span>{event.capacity} Seats</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    🏷️ <span>{event.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col justify-end items-end gap-3 self-center w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                <button
                  onClick={() => handleApprove(event._id)}
                  className="w-full lg:w-32 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl shadow-lg shadow-green-600/10 transition active:scale-95"
                >
                  Approve ✓
                </button>

                <button
                  onClick={() => handleReject(event._id)}
                  className="w-full lg:w-32 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition active:scale-95"
                >
                  Reject ✗
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-5xl">🎉</span>
          <h3 className="text-lg font-bold text-slate-800 mt-4">
            All Caught Up!
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            No pending event approval requests at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventApproval;