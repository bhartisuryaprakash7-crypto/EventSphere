import { useState } from 'react';

const Certificates = () => {
  const [certs] = useState([
    { id: 'CERT-WM-98', eventName: 'Web3 BootCamp Masterclass', issueDate: 'June 12, 2026', credentialId: 'CRD-UI-88310' },
    { id: 'CERT-UX-41', eventName: 'UI/UX Interactive Workshop', issueDate: 'May 28, 2026', credentialId: 'CRD-UX-11204' }
  ]);

  const handleDownload = (name) => {
    alert(`📄 Dynamic PDF structure generating for "${name}" certificate ledger...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">E-Certificates Vault</h1>
        <p className="text-slate-500 mt-1">Claim authenticated, secure university credentials for events you have successfully attended.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certs.map((cert) => (
          <div key={cert.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-all group border-t-4 border-t-indigo-600">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-400 uppercase tracking-wide">Verified Asset</span>
              <h3 className="text-xl font-black text-slate-800 mt-2 group-hover:text-indigo-600 transition">{cert.eventName}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Issued on: <span className="text-slate-600 font-semibold">{cert.issueDate}</span></p>
              <p className="text-[11px] text-slate-400 font-mono mt-3">Hash ID: {cert.credentialId}</p>
            </div>
            
            <button
              onClick={() => handleDownload(cert.eventName)}
              className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 hover:border-indigo-600 transition"
            >
              📥 Download PDF Document
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;