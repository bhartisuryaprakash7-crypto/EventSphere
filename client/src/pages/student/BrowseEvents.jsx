import { useState } from 'react';

// Sample Mock Data (Events List)
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Hack-O-Sphere 2026',
    category: 'Technical',
    date: 'July 15, 2026',
    time: '10:00 AM',
    venue: 'Main Seminar Hall',
    organizer: 'Computer Science Dept.',
    image: '💻',
    tags: ['Coding', 'Hackathon', 'AI'],
    status: 'Open'
  },
  {
    id: 2,
    title: 'Spandan: Cultural Fest',
    category: 'Cultural',
    date: 'August 02, 2026',
    time: '04:00 PM',
    venue: 'Open Air Theater (OAT)',
    organizer: 'Cultural Committee',
    image: '🎸',
    tags: ['Music', 'Dance', 'Drama'],
    status: 'Open'
  },
  {
    id: 3,
    title: 'Robo-Soccer Championship',
    category: 'Technical',
    date: 'July 22, 2026',
    time: '11:30 AM',
    venue: 'Robotics Lab',
    organizer: 'IoT & Robotics Club',
    image: '🤖',
    tags: ['Robotics', 'Competition'],
    status: 'Filling Fast'
  },
  {
    id: 4,
    title: 'National Corporate Webinar',
    category: 'Workshop',
    date: 'September 05, 2026',
    time: '02:00 PM',
    venue: 'Online (Zoom)',
    organizer: 'Placement Cell',
    image: '📈',
    tags: ['Career', 'Webinar', 'Finance'],
    status: 'Open'
  }
];

const BrowseEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories list for filtering
  const categories = ['All', 'Technical', 'Cultural', 'Workshop'];

  // Filter Logic
  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Browse Campus Events</h1>
          <p className="text-slate-500 mt-1">Discover, explore, and register for upcoming college activities.</p>
        </div>
      </div>

      {/* Filters Section (Search Bar + Category Pills) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search events or departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid Card Section */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Banner Part */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-slate-50 relative flex items-center justify-between border-b border-slate-100">
                <div className="text-4xl p-3 bg-white rounded-2xl shadow-sm border border-slate-100">{event.image}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  ● {event.status}
                </span>
              </div>

              {/* Card Body content */}
              <div className="p-6 flex-1">
                <span className="text-xs font-bold uppercase text-indigo-600 tracking-widest">{event.category}</span>
                <h3 className="text-xl font-bold text-slate-800 mt-1 line-clamp-1">{event.title}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Organized by: {event.organizer}</p>

                {/* Event Details (Date/Time/Venue) */}
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="font-medium">{event.date}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="font-medium truncate">{event.venue}</span>
                  </div>
                </div>

                {/* Tags mapping */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {event.tags.map((tag, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Action Button */}
              <div className="p-6 pt-0">
                <button 
                  onClick={() => alert(`Registered successfully for ${event.title}!`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/10 transition-all active:scale-[0.98]"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Image/Message */
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-5xl">📭</span>
          <h3 className="text-lg font-bold text-slate-800 mt-4">No Events Found</h3>
          <p className="text-slate-400 text-sm mt-1">Try changing the search term or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;