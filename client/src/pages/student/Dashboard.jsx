import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

function StudentDashboard() {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [qrData, setQrData] = useState("");
  
  const canvasRef = useRef(null);

  const generateQR = () => {
    if (!name.trim() || !roll.trim()) return;
    setQrData(`${roll.trim()}|${name.trim()}`);
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    
    if (!canvas) {
      alert("QR Code element not found!");
      return;
    }

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `QR_${roll || "student"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFormValid = name.trim() !== "" && roll.trim() !== "";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r invert-0 from-blue-600 to-indigo-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold tracking-tight">Student Portal</h2>
          <p className="text-blue-100 text-sm mt-1">Generate your digital attendance identity</p>
        </div>
        
        {/* Main Content Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
            <input 
              className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400" 
              placeholder="e.g. Rahul Sharma" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Roll Number</label>
            <input 
              className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400" 
              placeholder="e.g. CS202645" 
              value={roll} 
              onChange={e => setRoll(e.target.value)} 
            />
          </div>
          
          <button 
            onClick={generateQR} 
            disabled={!isFormValid}
            className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-md ${
              isFormValid 
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] shadow-blue-200" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            Generate QR Code
          </button>

          {/* QR Output Section */}
          {qrData && (
            <div className="mt-6 pt-6 border-t border-dashed border-slate-200 text-center animate-fade-in">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 inline-block w-full">
                <div className="mb-4">
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium mb-2">
                    ✓ ID Verified
                  </span>
                  <p className="font-bold text-xl text-slate-800 leading-tight">{name}</p>
                  <p className="text-slate-500 text-sm mt-0.5 font-mono">Roll: {roll}</p>
                </div>
                
                <div className="flex justify-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm mx-auto w-max max-w-full">
                  <QRCodeCanvas 
                    ref={canvasRef}
                    value={qrData} 
                    size={160} 
                    level="H" 
                    includeMargin={true}
                  />
                </div>
                
                <button 
                  onClick={downloadQR} 
                  className="mt-5 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 w-full transition-all duration-200 shadow-md shadow-emerald-100 active:scale-[0.99]"
                >
                  Download PNG
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;