import { useState } from 'react';

const Recommendation = () => {
  const [profileTags, setProfileTags] = useState(['React', 'Web3', 'Ui/Ux Design', 'Public Speaking']);
  const [inputValue, setInputValue] = useState('');

  const [recommendations] = useState([
    { id: 'REC-01', title: 'National Crypto Developers Hackathon', score: '98% Match Score', reasoning: 'Match criteria triggered based on your interest in Web3 pipelines.' },
    { id: 'REC-02', title: 'Figma Prototyping Masterclass', score: '89% Match Score', reasoning: 'Aligned heavily with your core profile tags containing UX design framework setups.' },
  ]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (profileTags.includes(inputValue.trim())) return setInputValue('');
    setProfileTags([...profileTags, inputValue.trim()]);
    setInputValue('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Interest Matrix Setter */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Interest Meta-Matrix</h3>
        <p className="text-xs text-slate-400 mb-4">Add core programming skill strings or hobbies to calculate live recommendations.</p>
        
        <form onSubmit={handleAddTag} className="mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type skill & press Enter"
            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </form>

        <div className="flex flex-wrap gap-1.5">
          {profileTags.map((tag, idx) => (
            <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1">
              {tag}
              <button 
                type="button" 
                onClick={() => setProfileTags(profileTags.filter(t => t !== tag))} 
                className="hover:text-red-500 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Target Live Pipeline Results */}
      <div className="lg:col-span-2 space-y-4">
        <div className="p-1">
          <h2 className="text-xl font-black text-slate-800">Vector matching recommendation logs</h2>
          <p className="text-xs text-slate-400 mt-0.5">Calculated neural affinity weights against active database entries.</p>
        </div>

        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-indigo-600">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-indigo-600 bg-indigo-50 font-mono font-bold px-1.5 py-0.5 rounded border border-indigo-100">{rec.id}</span>
                <span className="text-xs font-bold text-emerald-600 font-mono">● {rec.score}</span>
              </div>
              <h4 className="text-base font-bold text-slate-800">{rec.title}</h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">{rec.reasoning}</p>
            </div>
            <button className="whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase px-4 py-2 rounded-xl transition self-start sm:self-center">
              Quick Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendation;