// pages/student/Feedback.jsx
import { useState, useEffect } from "react";
import { getMyRegistrations, submitFeedback, checkFeedbackExists } from "../../services/eventService";
import toast from "react-hot-toast";

const ASPECTS = [
  { id: "organisation", label: "Organisation & Management" },
  { id: "content",      label: "Content Quality"           },
  { id: "venue",        label: "Venue & Infrastructure"    },
  { id: "food",         label: "Food & Refreshments"       },
];

const StarRating = ({ value, onChange, label }) => (
  <div>
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</p>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          className={`text-2xl transition-all hover:scale-110 ${star <= value ? "text-amber-400" : "text-slate-200 hover:text-amber-200"}`}
        >
          ★
        </button>
      ))}
      <span className="text-xs font-bold text-slate-400 self-center ml-1">{value}/5</span>
    </div>
  </div>
);

const Feedback = () => {
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [ratings, setRatings]   = useState({ overall: 5, organisation: 4, content: 4, venue: 4, food: 4 });
  const [comment, setComment]   = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Load only attended events (eligible for feedback)
  useEffect(() => {
    (async () => {
      try {
        const res = await getMyRegistrations();
        const attended = (res.data || []).filter((r) => r.status === "Attended");
        setAttendedEvents(attended);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, []);

  // Check if feedback already given for selected event
  useEffect(() => {
    if (!selectedEventId) { setAlreadySubmitted(false); return; }
    (async () => {
      try {
        const res = await checkFeedbackExists(selectedEventId);
        setAlreadySubmitted(res.data?.exists || false);
      } catch {
        setAlreadySubmitted(false);
      }
    })();
  }, [selectedEventId]);

  const setRating = (key, val) => setRatings((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return toast.error("Please select an event.");
    if (!comment.trim()) return toast.error("Please write a review.");
    if (alreadySubmitted) return toast.error("You've already submitted feedback for this event.");

    setSubmitting(true);
    try {
      await submitFeedback({
        eventId:   selectedEventId,
        ratings,
        comment:   comment.trim(),
        anonymous,
      });
      toast.success("🙏 Feedback submitted! Thank you.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSelectedEventId("");
    setComment("");
    setRatings({ overall: 5, organisation: 4, content: 4, venue: 4, food: 4 });
    setAnonymous(false);
    setAlreadySubmitted(false);
  };

  const selectedEvent = attendedEvents.find(
    (r) => (r.event?._id || r.eventId) === selectedEventId
  );

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
        <span className="text-6xl">🎉</span>
        <h2 className="text-2xl font-black text-slate-800">Thank You!</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          Your feedback helps us improve future events. Your voice matters!
        </p>
        <button
          onClick={resetForm}
          className="mt-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition"
        >
          Submit Another Feedback
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Feedback</h1>
        <p className="text-slate-500 mt-1 text-sm">Share your experience to help us make events better.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Section: Select Event */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-3">1. Select Event</h2>

          {loadingEvents ? (
            <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
          ) : attendedEvents.length === 0 ? (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700 font-medium">
              ⚠️ No attended events found. Attend an event to give feedback.
            </div>
          ) : (
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value="">— Choose an attended event —</option>
              {attendedEvents.map((reg) => {
                const id   = reg.event?._id || reg.eventId;
                const name = reg.event?.title || reg.eventName;
                return <option key={id} value={id}>{name}</option>;
              })}
            </select>
          )}

          {/* Already submitted warning */}
          {alreadySubmitted && (
            <div className="mt-3 bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm text-rose-600 font-medium">
              ✋ You've already submitted feedback for this event.
            </div>
          )}

          {/* Selected event info pill */}
          {selectedEvent && !alreadySubmitted && (
            <div className="mt-3 flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="text-sm font-bold text-indigo-700">{selectedEvent.event?.title || selectedEvent.eventName}</p>
                <p className="text-xs text-indigo-400">
                  {selectedEvent.event?.date
                    ? new Date(selectedEvent.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" })
                    : ""} • {selectedEvent.event?.venue || ""}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section: Ratings */}
        <div className="p-6 border-b border-slate-100 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-1">2. Rate Your Experience</h2>

          <StarRating value={ratings.overall} onChange={(v) => setRating("overall", v)} label="Overall Experience" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ASPECTS.map((a) => (
              <StarRating key={a.id} value={ratings[a.id]} onChange={(v) => setRating(a.id, v)} label={a.label} />
            ))}
          </div>
        </div>

        {/* Section: Comment */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-3">3. Your Review</h2>
          <textarea
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about the event — what went well, what could be improved, any specific suggestions..."
            className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition resize-none"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{comment.length}/1000 chars</p>
        </div>

        {/* Section: Anonymous toggle + Submit */}
        <div className="p-6 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setAnonymous(!anonymous)}
              className={`relative w-10 h-5 rounded-full transition ${anonymous ? "bg-indigo-600" : "bg-slate-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${anonymous ? "left-5" : "left-0.5"}`} />
            </div>
            <span className="text-xs font-semibold text-slate-600">Submit anonymously</span>
          </label>

          <button
            type="submit"
            disabled={submitting || alreadySubmitted || attendedEvents.length === 0}
            className="px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting…
              </span>
            ) : "Submit Feedback →"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;