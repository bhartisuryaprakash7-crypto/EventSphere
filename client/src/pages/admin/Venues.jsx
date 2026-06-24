import { useState } from 'react';

const INITIAL_VENUES = [
  { id: 'V-101', name: 'Main Auditorium', capacity: 500, type: 'Indoor', status: 'Available' },
  { id: 'V-102', name: 'Seminar Hall 1', capacity: 120, type: 'Indoor', status: 'Booked' },
  { id: 'V-103', name: 'Open Air Theater (OAT)', capacity: 1200, type: 'Outdoor', status: 'Available' },
  { id: 'V-104', name: 'Central Library Conference Room', capacity: 50, type: 'Indoor', status: 'Maintenance' },
];

const Venues = () => {
  const [venues, setVenues] = useState(INITIAL_VENUES);
  const [newVenue, setNewVenue] = useState({ name: '', capacity: '', type: 'Indoor' });

  const handleAddVenue = (e) => {
    e.preventDefault();
    if (!newVenue.name || !newVenue.capacity) return alert('Please fill all fields');
    
    const venueObj = {
      id: `V-${Math.floor(100 + Math.random() * 900)}`,
      name: newVenue.name,
      capacity: parseInt(newVenue.capacity),
      type: newVenue.type,
      status: 'Available'
    };

    setVenues([...venues, venueObj]);
    setNewVenue({ name: '', capacity: '', type: 'Indoor' });
    alert('🏛️ Naya Venue successfully add ho gaya!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Add New Venue Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add Campus Venue</h3>
        <form onSubmit={handleAddVenue} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Venue Name</label>
            <input
              type="text"
              value={newVenue.name}
              onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
              placeholder="e.g., Tech Block Seminar Room"
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Seating Capacity</label>
            <input
              type="number"
              value={newVenue.capacity}
              onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })}
              placeholder="e.g., 150"
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Type</label>
            <select
              value={newVenue.type}
              onChange={(e) => setNewVenue({ ...newVenue, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="Indoor">Indoor (AC Hall/Lab)</option>
              <option value="Outdoor">Outdoor (Ground/OAT)</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase py-2.5 rounded-xl transition">
            + Save Venue
          </button>
        </form>
      </div>

      {/* Right Column: Venues List Table */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">Campus Infrastructure Layout</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Venue Name</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Allocation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {venues.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{v.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{v.id}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-600">{v.capacity} Seats</td>
                  <td className="p-4 text-slate-500">{v.type}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      v.status === 'Available' ? 'bg-green-100 text-green-700' : v.status === 'Booked' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      ● {v.status}
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

export default Venues;