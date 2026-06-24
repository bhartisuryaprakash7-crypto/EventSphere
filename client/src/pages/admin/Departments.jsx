import { useState } from 'react';

const Departments = () => {
  const [depts] = useState([
    { code: 'CSE', name: 'Computer Science & Engineering', head: 'Dr. R. K. Singh', activeEvents: 3, totalMembers: 450 },
    { code: 'ECE', name: 'Electronics & Comm. Engineering', head: 'Dr. Smita Patra', activeEvents: 1, totalMembers: 280 },
    { code: 'ME', name: 'Mechanical Engineering', head: 'Prof. S. Jha', activeEvents: 0, totalMembers: 190 },
    { code: 'CUL', name: 'Central Cultural Committee', head: 'Mrs. Neha Anand', activeEvents: 2, totalMembers: 600 },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">University Departments</h1>
        <p className="text-slate-500 mt-1">Overview department coordinators, faculty leads, and core engagement numbers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {depts.map((dept) => (
          <div key={dept.code} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-indigo-300 transition">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-mono">{dept.code}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${dept.activeEvents > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                  {dept.activeEvents} Running Events
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{dept.name}</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Head of Department / Coordinator: <span className="text-slate-600 font-semibold">{dept.head}</span></p>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between text-sm text-slate-500 font-medium">
              <span>Student Base Size:</span>
              <span className="font-bold text-slate-800">{dept.totalMembers} Enrolled</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;