import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { saveAttendance, fetchAttendanceByEvent } from "../../services/attendanceService";

function OrganizerAttendance({ eventId = "DEFAULT_EVENT_ID" }) { // Real app me eventId routing se aayegi
  const [attendanceList, setAttendanceList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch initial attendance list from Database
  useEffect(() => {
    fetchAttendanceByEvent(eventId)
      .then((res) => setAttendanceList(res.data))
      .catch((err) => console.error(err));
  }, [eventId]);

  // QR Scanner Initialization
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);

    scanner.render(
      async (decodedText) => {
        const [roll, name] = decodedText.split("|");
        if (!roll || !name) return;

        try {
          // Send scanned data to Backend API
          const response = await saveAttendance({ eventId, rollNumber: roll, studentName: name });
          if (response.success) {
            // Update UI list safely without duplication
            setAttendanceList((prev) => {
              if (prev.some((item) => item.rollNumber === roll)) return prev;
              return [...prev, response.data];
            });
          }
        } catch (error) {
          setErrorMsg(error.response?.data?.message || "Error scanning QR");
        }
      },
      (error) => { /* Console noise reduce karne ke liye blank chor sakte hain */ }
    );

    return () => {
      scanner.clear().catch((err) => console.error("Scanner clear error", err));
    };
  }, [eventId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Event Attendance Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scanner Component */}
        <div className="bg-white p-5 rounded-xl shadow-md border col-span-1">
          <h2 className="text-xl font-semibold mb-4">Scan Student QR</h2>
          <div id="reader"></div>
          {errorMsg && <p className="text-red-500 mt-2 text-sm font-medium">{errorMsg}</p>}
        </div>

        {/* Attendance Table Component */}
        <div className="bg-white p-5 rounded-xl shadow-md border col-span-2">
          <h2 className="text-xl font-semibold mb-4">Live Attendance Roll ({attendanceList.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 border">Roll Number</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map((student) => (
                  <tr key={student._id || student.rollNumber} className="hover:bg-slate-50">
                    <td className="p-3 border">{student.rollNumber}</td>
                    <td className="p-3 border">{student.studentName}</td>
                    <td className="p-3 border text-green-600 font-bold">{student.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerAttendance;