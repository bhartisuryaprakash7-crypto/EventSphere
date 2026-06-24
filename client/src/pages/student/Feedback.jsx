import { useState } from 'react';

const Feedback = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const pastEvents = ['Web3 BootCamp', 'Ui/Ux Design Masterclass', 'Python AI Workshop'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEvent || !comment) return alert('Sabhi fields fill karein!');
    
    alert(`⭐ Feedback submitted for "${selectedEvent}"! Thank you for making our campus better.`);
    setSelectedEvent('');
    setComment('');
    setRating(5);
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
      <div className="text-center mb-6">
        <span className="text-4xl">📝</span>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-2">Submit Event Feedback</h2>
        <p className="text-xs text-slate-400 mt-0.5">Your anonymous reports help AI engines build better operational zones.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Select Attended Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          >
            <option value="">-- Choose Event --</option>
            {pastEvents.map((evt, i) => <option key={i} value={evt}>{evt}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Overall Experience Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl p-1 transition ${star <= rating ? 'text-amber-400 scale-110' : 'text-slate-200'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Detailed Review / Suggestions</label>
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about infrastructure, food quality, or speech timings..."
            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition resize-none"
          />
        </div>

        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase py-3 rounded-xl transition shadow-lg">
          Submit Form Summary
        </button>
      </form>
    </div>
  );
};

export default Feedback;