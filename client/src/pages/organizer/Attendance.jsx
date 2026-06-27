import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { saveAttendance, fetchAttendanceByEvent } from "../../services/attendanceService";
import api from "../../services/api";

// ─── Toast ────────────────────────────────────────────────────
const Toast = ({ msg, type }) => {
  if (!msg) return null;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border
      ${type === "success"
        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
        : "bg-red-50 border-red-200 text-red-700"}`}>
      <span>{type === "success" ? "✅" : "❌"}</span>
      {msg}
    </div>
  );
};

// ─── View 1: Approved Events List ────────────────────────────
const EventsList = ({ onSelect }) => {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/events/mine");
        const all = res.data?.data ?? res.data ?? [];
        const approved = all.filter(
          (e) => (e.status ?? "").toLowerCase() === "approved"
        );
        setEvents(approved);
      } catch (err) {
        setError(err.response?.data?.message ?? "Events load nahi ho sake.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Attendance Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Approved event select karo, phir QR scan karo.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="h-5 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-9 bg-slate-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Attendance Management</h1>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-bold text-red-700 text-sm">{error}</p>
          <button onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Attendance Management
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Approved events niche hain — kisi pe click karo aur QR scan shuru karo.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-5xl mb-4">🎪</p>
          <h3 className="text-lg font-bold text-slate-700">Koi approved event nahi hai</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
            Faculty ne abhi koi event approve nahi kiya. Pehle event create karo aur approval ka wait karo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => {
            const id  = ev._id ?? ev.id;
            const cap = ev.capacity ?? 0;
            const reg = ev.registrationCount ?? ev.registrations ?? 0;
            const pct = cap > 0 ? Math.min(Math.round((reg / cap) * 100), 100) : 0;

            return (
              <div key={id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4
                           hover:shadow-md hover:border-indigo-200 transition-all">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-800 text-base leading-snug">{ev.title}</h3>
                    <span className="flex-shrink-0 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                      ● Approved
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5"><span>📅</span>{formatDate(ev.date)}{ev.time ? ` · ${ev.time}` : ""}</p>
                    <p className="flex items-center gap-1.5"><span>📍</span>{ev.venue ?? "—"}</p>
                    <p className="flex items-center gap-1.5"><span>🏷️</span>{ev.category ?? "—"}</p>
                  </div>
                  {cap > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Registrations</span>
                        <span className="font-semibold">{reg}/{cap}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 100 ? "bg-red-400" : "bg-indigo-500"}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onSelect(ev)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold
                             rounded-xl transition active:scale-95 flex items-center justify-center gap-2">
                  <span>📷</span> Start Attendance Scan
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── View 2: QR Scanner + Attendance Table ────────────────────
const ScannerView = ({ event, onBack }) => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loadingList, setLoadingList]       = useState(true);
  const [successMsg, setSuccessMsg]         = useState("");
  const [errorMsg, setErrorMsg]             = useState("");
  const [search, setSearch]                 = useState("");
  const isScanning = useRef(false);

  const eventId = event._id ?? event.id;

  const flash = (setter, msg, duration = 3500) => {
    setter(msg);
    setTimeout(() => setter(""), duration);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingList(true);
        const res = await fetchAttendanceByEvent(eventId);
        if (res.success) setAttendanceList(res.data ?? []);
      } catch (err) {
        console.error("Attendance fetch error:", err);
      } finally {
        setLoadingList(false);
      }
    };
    load();
  }, [eventId]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 200, height: 200 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (isScanning.current) return;
        isScanning.current = true;
        try {
          let qrData;
          try { qrData = JSON.parse(decodedText); }
          catch {
            const [rollNumber, studentName] = decodedText.split("|");
            qrData = { rollNumber, studentName };
          }
          if (!qrData.rollNumber || !qrData.studentName) throw new Error("Invalid QR Code");

          const response = await saveAttendance({
            eventId,
            studentId:      qrData.studentId,
            registrationId: qrData.registrationId,
            rollNumber:     qrData.rollNumber,
            studentName:    qrData.studentName,
          });

          if (response.success) {
            setAttendanceList((prev) => {
              const exists = prev.find((a) => a.rollNumber === qrData.rollNumber);
              if (exists) return prev;
              return [...prev, response.data];
            });
            flash(setSuccessMsg, `${qrData.studentName} (${qrData.rollNumber}) — Present!`);
            setErrorMsg("");
          }
        } catch (err) {
          flash(setErrorMsg, err.response?.data?.message ?? err.message ?? "Attendance mark nahi ho saki");
          setSuccessMsg("");
        } finally {
          setTimeout(() => { isScanning.current = false; }, 2000);
        }
      },
      () => {}
    );

    return () => { scanner.clear().catch(() => {}); };
  }, [eventId]);

  const filtered = attendanceList.filter((s) =>
    !search ||
    s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (d) =>
    d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—";

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={onBack}
          className="self-start flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200
                     text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
          ← Back
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">
            {event.title}
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            📍 {event.venue ?? "—"} &nbsp;·&nbsp; 📅 {formatDate(event.date)}
          </p>
        </div>
        <div className="flex-shrink-0 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-2 text-center">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Present</p>
          <p className="text-3xl font-black text-indigo-600 leading-tight">{attendanceList.length}</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* QR Scanner */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">📷 Scan Student QR</h2>
            <p className="text-xs text-slate-400 mt-0.5">Camera ke saamne student ka QR code rakho</p>
          </div>
          <div id="qr-reader" className="rounded-xl overflow-hidden w-full" />
          {successMsg && <Toast msg={successMsg} type="success" />}
          {errorMsg   && <Toast msg={errorMsg}   type="error"   />}
        </div>

        {/* Attendance Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-800">
              Live Attendance
              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                {attendanceList.length}
              </span>
            </h2>
            <input
              type="text"
              placeholder="Name ya roll no. search karo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <th className="px-3 py-3">#</th>
                  <th className="px-3 py-3">Roll No.</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingList ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-3 py-3">
                        <div className="h-4 bg-slate-100 rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      <p className="text-2xl mb-2">👤</p>
                      <p className="text-xs font-medium">
                        {search ? "Koi match nahi mila" : "Abhi koi scan nahi hua"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((student, idx) => (
                    <tr key={student._id ?? idx} className="hover:bg-slate-50 transition">
                      <td className="px-3 py-3 text-slate-400 font-medium">{idx + 1}</td>
                      <td className="px-3 py-3 font-mono font-semibold text-slate-700">{student.rollNumber}</td>
                      <td className="px-3 py-3 font-medium text-slate-800">{student.studentName}</td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                          ● {student.status ?? "Present"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-400">
                        {formatTime(student.scannedAt ?? student.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Root: URL eventId se direct open, ya list se select ─────
function OrganizerAttendance() {
  const { eventId } = useParams();
  const navigate    = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!eventId) return;
    api.get(`/events/${eventId}`)
      .then((res) => {
        const ev = res.data?.data ?? res.data;
        if (ev) setSelectedEvent(ev);
      })
      .catch(() => {});
  }, [eventId]);

  const handleBack = () => {
    if (eventId) navigate("/organizer/manage");
    else setSelectedEvent(null);
  };

  if (selectedEvent) return <ScannerView event={selectedEvent} onBack={handleBack} />;
  return <EventsList onSelect={setSelectedEvent} />;
}

export default OrganizerAttendance;