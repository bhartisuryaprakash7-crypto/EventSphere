import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  saveAttendance,
  fetchAttendanceByEvent,
} from "../../services/attendanceService";
import api from "../../services/api";

// ─── Toast ────────────────────────────────────────────────────
const Toast = ({ msg, type }) => {
  if (!msg) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold mt-4 border
        ${isSuccess
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-red-50 border-red-200 text-red-700"
        }`}
    >
      <span className="text-lg">{isSuccess ? "✅" : "❌"}</span>
      {msg}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────
function OrganizerAttendance() {
  const { eventId } = useParams();

  const [eventInfo, setEventInfo]         = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loadingList, setLoadingList]     = useState(true);
  const [successMsg, setSuccessMsg]       = useState("");
  const [errorMsg, setErrorMsg]           = useState("");
  const [search, setSearch]               = useState("");

  const isScanning = useRef(false);
  const scannerRef = useRef(null);

  // ── Flash helpers ──
  const flash = (setter, msg, duration = 3500) => {
    setter(msg);
    setTimeout(() => setter(""), duration);
  };

  // ── Fetch event info (title, etc.) ──
  useEffect(() => {
    if (!eventId) return;
    api.get(`/events/${eventId}`)
      .then((res) => setEventInfo(res.data?.data ?? res.data))
      .catch(() => {}); // non-critical
  }, [eventId]);

  // ── Fetch attendance list ──
  useEffect(() => {
    if (!eventId) return;
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

  // ── QR Scanner ──
  useEffect(() => {
    if (!eventId) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 220, height: 220 } },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        if (isScanning.current) return;
        isScanning.current = true;

        try {
          let qrData;
          try {
            qrData = JSON.parse(decodedText);
          } catch {
            const [rollNumber, studentName] = decodedText.split("|");
            qrData = { rollNumber, studentName };
          }

          if (!qrData.rollNumber || !qrData.studentName) {
            throw new Error("Invalid QR Code — rollNumber ya studentName missing hai");
          }

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
            flash(setSuccessMsg, `${qrData.studentName} (${qrData.rollNumber}) marked present`);
            setErrorMsg("");
          }
        } catch (err) {
          flash(
            setErrorMsg,
            err.response?.data?.message ?? err.message ?? "Attendance mark nahi ho saki"
          );
          setSuccessMsg("");
        } finally {
          setTimeout(() => { isScanning.current = false; }, 2000);
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [eventId]);

  // ── Filtered list ──
  const filtered = attendanceList.filter((s) =>
    !search ||
    s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Guards ──
  if (!eventId) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-red-600 font-semibold">Event ID nahi mila. URL check karo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Attendance Management
        </h1>
        {eventInfo && (
          <p className="text-slate-500 mt-1 text-sm">
            📅 {eventInfo.title} &nbsp;·&nbsp; {eventInfo.venue ?? ""} &nbsp;·&nbsp;
            <span className={`font-semibold ${eventInfo.status === "approved" ? "text-emerald-600" : "text-amber-600"}`}>
              {eventInfo.status?.toUpperCase()}
            </span>
          </p>
        )}
      </div>

      {/* ── Approval warning ── */}
      {eventInfo && eventInfo.status !== "approved" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
          <span className="text-amber-500 text-xl">⚠️</span>
          <div>
            <p className="font-bold text-amber-800 text-sm">Event abhi approved nahi hai</p>
            <p className="text-amber-600 text-xs mt-0.5">
              Faculty ne abhi approve nahi kiya — attendance scan ho sakta hai par event status
              "<strong>{eventInfo.status}</strong>" hai.
            </p>
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* QR Scanner Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Student QR Scan</h2>
            <p className="text-xs text-slate-400 mt-0.5">Camera ke saamne student ka QR code rakho</p>
          </div>

          {/* scanner mounts here */}
          <div id="qr-reader" className="rounded-xl overflow-hidden" />

          <Toast msg={successMsg} type="success" />
          <Toast msg={errorMsg}   type="error"   />

          {/* Live counter badge */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Today</span>
            <span className="text-2xl font-black text-indigo-600">{attendanceList.length}</span>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:col-span-2 space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Live Attendance
                <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                  {attendanceList.length}
                </span>
              </h2>
            </div>
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Roll No.</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingList ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="h-4 bg-slate-100 rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <p className="text-3xl mb-2">👤</p>
                      <p className="text-sm font-medium">
                        {search ? "Koi match nahi mila" : "Abhi koi attendance mark nahi hua"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((student, idx) => (
                    <tr key={student._id ?? idx} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-slate-400 font-medium">{idx + 1}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                        {student.rollNumber}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {student.studentName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                          ● {student.status ?? "Present"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {student.markedAt
                          ? new Date(student.markedAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
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
}

export default OrganizerAttendance;