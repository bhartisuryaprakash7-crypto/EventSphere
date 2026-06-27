
import { useState } from "react";
import { createEvent } from "../../services/eventService";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    date: '',
    time: '',
    venue: '',
    description: '',
    capacity: '',
    tags: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createEvent({
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim())
    });

    alert("✅ Event Created Successfully");

    setFormData({
      title: "",
      category: "Technical",
      date: "",
      time: "",
      venue: "",
      description: "",
      capacity: "",
      tags: "",
    });

  } catch (error) {
    console.error(error);
    alert("❌ Event creation failed");
  }
};


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create New Event</h1>
        <p className="text-slate-500 mt-1">Fill in the details below to host a new event on EventSphere.</p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Event Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700">Event Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., National Coding Techfest 2026"
              className="mt-1.5 block w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category & Capacity (Grid Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1.5 block w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Workshop">Workshop</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Maximum Capacity (Seats) *</label>
              <input
                type="number"
                name="capacity"
                required
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 150"
                className="mt-1.5 block w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Date, Time & Venue (Grid Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Date *</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="mt-1.5 block w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Time *</label>
              <input
                type="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="mt-1.5 block w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Venue / Location *</label>
              <input
                type="text"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g., Audi-2 or Zoom"
                className="mt-1.5 block w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700">Event Description *</label>
            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a brief description about the event guidelines, rules, or key highlights..."
              className="mt-1.5 block w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
            ></textarea>
          </div>

          {/* Tags / Keywords */}
          <div>
            <label className="block text-sm font-semibold text-slate-700">Tags (Comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., coding, hackathon, web3"
              className="mt-1.5 block w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <p className="text-xs text-slate-400 mt-1">Separate keywords with a comma (,)</p>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/10 transition active:scale-95"
            >
              Publish Event
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEvent;