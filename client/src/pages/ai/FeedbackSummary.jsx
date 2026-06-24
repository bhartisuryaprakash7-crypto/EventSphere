import { useState } from 'react';

const FeedbackSummary = () => {
  const [metrics] = useState({
    positiveScore: '84%',
    neutralScore: '11%',
    negativeScore: '5%',
    sampleCount: 1420
  });

  const [aiInsights] = useState([
    { topic: 'Food & Catering Quality', status: 'Critical Fix Needed', description: '64% complaints point out poor management in lunch counters during Technical Fest day 2.', type: 'negative' },
    { topic: 'Technical Workshop Setup', status: 'Outstanding Praise', description: '92% positive traction. Students demanded longer hands-on coding modules instead of single-day events.', type: 'positive' },
    { topic: 'Venue Seating Capacity', status: 'Scaling Advice', description: 'Air conditioning system inside Seminar Hall 1 was reported faulty across multiple summer events.', type: 'warning' }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Sentiment Feedback Lab</h1>
        <p className="text-slate-500 mt-1">Natural Language Processing running aggregate analysis on {metrics.sampleCount} collective forms.</p>
      </div>

      {/* Stats Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
          <div className="text-green-500 font-black text-3xl font-mono">{metrics.positiveScore}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Positive Sentiment</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
          <div className="text-amber-500 font-black text-3xl font-mono">{metrics.neutralScore}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Neutral Dynamic</div>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
          <div className="text-red-500 font-black text-3xl font-mono">{metrics.negativeScore}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Friction Backlog</div>
        </div>
      </div>

      {/* AI Key Insights Engine Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Synthesized LLM Core Recommendations</h3>
        
        <div className="space-y-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${
              insight.type === 'positive' ? 'bg-green-50/50 border-green-200' : insight.type === 'negative' ? 'bg-red-50/50 border-red-200' : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="flex justify-between items-center flex-wrap gap-2 mb-1.5">
                <span className="font-bold text-slate-800 text-sm">{insight.topic}</span>
                <span className={`text-[10px] uppercase font-mono font-black px-2 py-0.5 rounded ${
                  insight.type === 'positive' ? 'bg-green-100 text-green-700' : insight.type === 'negative' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {insight.status}
                </span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSummary;