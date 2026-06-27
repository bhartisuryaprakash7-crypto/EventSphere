// pages/student/Certificates.jsx
import { useState, useEffect } from "react";
import { getMyCertificates, downloadCertificate } from "../../services/eventService";
import toast from "react-hot-toast";

const categoryGradients = {
  Technical: "from-blue-600 to-indigo-700",
  Cultural:  "from-pink-500 to-rose-600",
  Workshop:  "from-amber-500 to-orange-600",
  Sports:    "from-green-500 to-emerald-600",
  default:   "from-indigo-600 to-violet-700",
};

const CertificateCard = ({ cert }) => {
  const [downloading, setDownloading] = useState(false);
  const gradient = categoryGradients[cert.event?.category] || categoryGradients.default;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await downloadCertificate(cert._id);
      // Create blob URL and trigger download
      const blob  = new Blob([res.data], { type: "application/pdf" });
      const url   = window.URL.createObjectURL(blob);
      const link  = document.createElement("a");
      link.href   = url;
      link.download = `Certificate-${cert.event?.title?.replace(/\s+/g, "-")}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Certificate downloaded!");
    } catch (err) {
      toast.error("Download failed. Try again.");
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      {/* Certificate Preview Banner */}
      <div className={`bg-gradient-to-br ${gradient} p-6 text-white relative overflow-hidden`}>
        {/* Decorative ring */}
        <div className="absolute -right-8 -top-8 w-32 h-32 border-8 border-white/10 rounded-full" />
        <div className="absolute -right-4 -top-4 w-20 h-20 border-4 border-white/10 rounded-full" />

        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
            🏅 Verified Certificate
          </span>
          <h3 className="text-xl font-black mt-3 leading-tight">{cert.event?.title || cert.eventName}</h3>
          <p className="text-sm text-white/70 mt-1">
            {cert.event?.category && (
              <span className="font-semibold">{cert.event.category} • </span>
            )}
            {cert.event?.organizer?.name || "Department"}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">Issued On</p>
            <p className="text-sm font-bold text-slate-700 mt-0.5">
              {new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">Event Date</p>
            <p className="text-sm font-bold text-slate-700 mt-0.5">
              {cert.event?.date
                ? new Date(cert.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : "—"}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wide">Credential Hash</p>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5 break-all">{cert.credentialId || cert._id}</p>
        </div>

        {/* Verified badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          <span className="text-lg">✅</span>
          <div>
            <p className="text-xs font-bold text-emerald-700">Authentic & Verified</p>
            <p className="text-[10px] text-emerald-500">Issued by College Event Management System</p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-wait"
        >
          {downloading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Generating PDF…
            </>
          ) : (
            <>📥 Download PDF Certificate</>
          )}
        </button>
      </div>
    </div>
  );
};

const Certificates = () => {
  const [certs,   setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyCertificates();
        setCerts(res.data);
      } catch (err) {
        setError("Could not load certificates.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">E-Certificates Vault</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Verified credentials auto-generated after attending events.
          </p>
        </div>
        {!loading && certs.length > 0 && (
          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase rounded-full border border-emerald-100">
            {certs.length} Certificate{certs.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-xl mt-0.5">ℹ️</span>
        <p className="text-sm text-indigo-700">
          Certificates are <strong>automatically generated</strong> after your attendance is marked by the organizer. 
          If you attended recently, it may take a few minutes to appear here.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
              <div className="h-32 bg-slate-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-2/3 bg-slate-100 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
                <div className="h-10 w-full bg-slate-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-12 bg-rose-50 rounded-2xl border border-rose-100">
          <p className="text-rose-500 font-semibold">{error}</p>
        </div>
      )}

      {/* Certificates Grid */}
      {!loading && !error && certs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <CertificateCard key={cert._id} cert={cert} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && certs.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <span className="text-5xl">🏅</span>
          <h3 className="text-xl font-black text-slate-700 mt-4">No Certificates Yet</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
            Attend events and get your attendance marked to earn verified certificates.
          </p>
        </div>
      )}
    </div>
  );
};

export default Certificates;