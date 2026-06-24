const Analytics = () => {
  const chartData = [
    { category: 'Technical Events', count: 45, percentage: 'Wider Reach' },
    { category: 'Cultural Fest', count: 85, percentage: 'High Engagement' },
    { category: 'Workshops', count: 30, percentage: 'Interactive' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Event Analytics</h1>
        <p className="text-slate-500 mt-1">Deep dive statistics and data visualization reports.</p>
      </div>

      {/* Progress Bars (Acts like Custom Tailwind Charts) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800">Registration Breakdown by Category</h3>
        
        <div className="space-y-4">
          {chartData.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>{item.category}</span>
                <span className="text-indigo-600">{item.count}% Share</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${item.count}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Summary Placeholder */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-12">
        <span className="text-4xl">📊</span>
        <h4 className="text-md font-bold text-slate-800 mt-3">Detailed Charts & Graphs</h4>
        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
          Once integrated with Chart.js or Recharts, real-time response graphs will reflect metrics right here.
        </p>
      </div>
    </div>
  );
};

export default Analytics;