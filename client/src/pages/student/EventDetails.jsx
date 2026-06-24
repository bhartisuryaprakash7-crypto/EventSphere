import { useState } from 'react';

const EventDetails = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  const eventData = {
    title: "Hack-O-Sphere 2026",
    description: "Join the ultimate 36-hour hackathon where minds collide to create innovative software and hardware solutions. Compete against top developers and win prizes worth ₹1,50,000!",
    organizer: "Computer Science Department",
    date: "July 15, 2026",
    time: "09:00 AM onwards",
    venue: "Main Auditorium & CSE Labs",
    capacity: 200,
    filled: 145,
    perks: ["Certificates", "Free Meals & Drinks", "Goodies Kit", "Mentorship from Experts"]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Banner Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <span className="text-xs uppercase bg-indigo-500/30 text-indigo-300 font-bold px-3 py-1 rounded-full backdrop-blur-md border border-indigo-500/20">
          🔥 Most Popular
        </span>
        <h1 className="text-4xl font-black mt-4 tracking-tight">{eventData.title}</h1>
        <p className="text-sm text-indigo-200/80 mt-1">Hosted by {eventData.organizer}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Columns: Description & Perks */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-slate-800">About the Event</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{eventData.description}</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">What's in it for you?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eventData.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <span className="text-emerald-500 text-base">✓</span> {perk}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Timings & Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase">Timing</span>
              <span className="text-sm font-bold text-slate-700">{eventData.date} ({eventData.time})</span>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <span className="block text-xs font-bold text-slate-400 uppercase">Location</span>
              <span className="text-sm font-bold text-slate-700">📍 {eventData.venue}</span>
            </div>
            
            {/* Live Capacity Bar */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Slots Filled</span>
                <span>{eventData.filled}/{eventData.capacity}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500" 
                  style={{ width: `${(eventData.filled / eventData.capacity) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsRegistered(!isRegistered)}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-lg ${
                isRegistered 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10'
              }`}
            >
              {isRegistered ? '✅ Claimed Pass Successful' : '🎟️ Reserve My Spot Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;