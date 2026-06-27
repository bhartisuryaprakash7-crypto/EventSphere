
// pages/student/BrowseEvents.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedEvents, registerForEvent } from "../../services/eventService";
import toast from "react-hot-toast";
 
const CATEGORIES = ["All", "Technical", "Cultural", "Workshop", "Sports"];
 
const categoryColors = {
  Technical: "bg-blue-50 text-blue-600 border-blue-100",
  Cultural:  "bg-pink-50 text-pink-600 border-pink-100",
  Workshop:  "bg-amber-50 text-amber-700 border-amber-100",
  Sports:    "bg-green-50 text-green-600 border-green-100",
};
 
const categoryEmojis = {
  Technical: "💻",
  Cultural:  "🎭",
  Workshop:  "🔧",
  Sports:    "⚽",
};
 
// ─── Single Event Card ─────────────────────────────────────────────────────
const EventCard = ({ event, onRegister }) => {
  const [loading, setLoading] = useState(false);
  const spotsLeft = event.capacity - (event.registeredCount || 0);
  const isFull    = spotsLeft <= 0;
  const isAlreadyRegistered = event.isRegistered;
 
  const handleRegister = async () => {
    if (isAlreadyRegistered || isFull) return;
    setLoading(true);
    try {
      await onRegister(event._id);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top color bar based on category */}
      <div className={`h-1.5 w-full ${
        event.category === "Technical" ? "bg-blue-500" :
        event.category === "Cultural"  ? "bg-pink-500" :
        event.category === "Workshop"  ? "bg-amber-500" :
        event.category === "Sports"    ? "bg-green-500" : "bg-indigo-500"
      }`} />
 
      <div className="p-6 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex justify-between items-start gap-2">
          <span className="text-3xl">{categoryEmojis[event.category] || "🎯"}</span>
          <div className="flex items-center gap-2">
            {event.category && (
              <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${categoryColors[event.category] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                {event.category}
              </span>
            )}
            {isAlreadyRegistered && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100">
                ✓ Registered
              </span>
            )}
          </div>
        </div>
 
        {/* Title & Organizer */}
        <h3 className="text-lg font-black text-slate-900 mt-3 group-hover:text-indigo-700 transition-colors leading-tight">
          {event.title}
        </h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          by {event.organizer?.name || "Organizer"}
        </p>
 
        {/* Description preview */}
        {event.description && (
          <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}
 
        {/* Details */}
        <div className="mt-4 space-y-1.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
 
        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {event.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}
 
        {/* Capacity bar */}
        {event.capacity > 0 && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>{isFull ? "Event Full" : `${spotsLeft} spots left`}</span>
              <span>{event.registeredCount || 0}/{event.capacity}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isFull ? "bg-rose-400" : spotsLeft < 20 ? "bg-amber-400" : "bg-indigo-500"}`}
                style={{ width: `${Math.min(((event.registeredCount || 0) / event.capacity) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
 
        {/* CTA Button */}
        <button
          onClick={handleRegister}
          disabled={loading || isAlreadyRegistered || isFull}
          className={`mt-5 w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all active:scale-95 ${
            isAlreadyRegistered
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
              : isFull
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : loading
              ? "bg-indigo-400 text-white cursor-wait"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Registering...
            </span>
          ) : isAlreadyRegistered ? "✅ Already Registered" : isFull ? "Event Full" : "🎟️ Register Now"}
        </button>
      </div>
    </div>
  );
};
 
// ─── Main Component ────────────────────────────────────────────────────────
const BrowseEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents]                   = useState([]);
  const [searchTerm, setSearchTerm]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
 
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApprovedEvents();
      setEvents(res.data);
    } catch (err) {
      setError("Could not load events. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => { fetchEvents(); }, [fetchEvents]);
 
  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(eventId);
      toast.success("🎉 Registered successfully! Check My Registrations.");
      // Optimistically update UI — mark this event as registered
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? { ...e, isRegistered: true, registeredCount: (e.registeredCount || 0) + 1 }
            : e
        )
      );
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    }
  };
 
  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      event.title?.toLowerCase().includes(search) ||
      event.organizer?.name?.toLowerCase().includes(search) ||
      event.venue?.toLowerCase().includes(search);
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
 
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Browse Campus Events</h1>
          <p className="text-slate-500 mt-1 text-sm">Discover, explore, and register for upcoming college activities.</p>
        </div>
        <button
          onClick={() => navigate("/student/my-registrations")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase rounded-xl hover:bg-slate-700 transition"
        >
          📋 My Registrations
        </button>
      </div>
 
      {/* Search + Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search by title, organizer, venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
 
      {/* Results count */}
      {!loading && (
        <p className="text-sm text-slate-400 font-medium">
          Showing <span className="text-slate-700 font-bold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
        </p>
      )}
 
      {/* Loading Skeleton */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 animate-pulse">
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-6 w-3/4 bg-slate-100 rounded" />
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
              <div className="space-y-2 mt-4">
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-3 w-2/3 bg-slate-100 rounded" />
              </div>
              <div className="h-10 w-full bg-slate-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      )}
 
      {/* Error */}
      {error && !loading && (
        <div className="text-center py-16 bg-rose-50 rounded-2xl border border-rose-100">
          <p className="text-rose-500 font-semibold">{error}</p>
          <button onClick={fetchEvents} className="mt-3 px-4 py-2 text-sm bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition">
            Retry
          </button>
        </div>
      )}
 
      {/* Events Grid */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} onRegister={handleRegister} />
          ))}
        </div>
      )}
 
      {/* Empty State */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <span className="text-5xl">🔍</span>
          <h3 className="text-xl font-black text-slate-700 mt-4">No Events Found</h3>
          <p className="text-slate-400 text-sm mt-2">Try a different search term or category.</p>
          <button
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
            className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
 
export default BrowseEvents;
 
