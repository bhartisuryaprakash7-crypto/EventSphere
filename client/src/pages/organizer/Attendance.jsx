import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { saveAttendance, fetchAttendanceByEvent } from "../../services/attendanceService";

function OrganizerAttendance() {
  const { eventId } = useParams(); // ✅ URL se real eventId aayegi
  const [attendanceList, setAttendanceList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // const isScanning = useRef(false); // ✅ duplicate scan rokne ke liye

  // Fetch initial attendance list from Database
  useEffect(() => {
    if (!eventId) return;
    fetchAttendanceByEvent(eventId)
      .then((res) => setAttendanceList(res.data))
      .catch((err) => console.error(err));
  }, [eventId]);

  // QR Scanner Initialization
  useEffect(() => {
    if (!eventId) return;

    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);

    scanner.render(
      async (decodedText) => {
        // ✅ Agar already ek scan process ho raha hai to ignore karo
        if (isScanning.current) return;
        isScanning.current = true;

        const [roll, name] = decodedText.split("|");
        if (!roll || !name) {
          isScanning.current = false;
          return;
        }

        try {
          const response = await saveAttendance({
            eventId,
            rollNumber: roll,
            studentName: name,
          });

          if (response.success) {
            setAttendanceList((prev) => {
              if (prev.some((item) => item.rollNumber === roll)) return prev;
              return [...prev, response.data];
            });
            setErrorMsg("");
            setSuccessMsg(`✅ ${name} (${roll}) attendance marked!`);
            setTimeout(() => setSuccessMsg(""), 3000);
          }
        } catch (error) {
          setErrorMsg(error.response?.data?.message || "Error scanning QR");
          setSuccessMsg("");
        } finally {
          // ✅ 2 seconds baad next student ka QR scan allow karo
          setTimeout(() => {
            isScanning.current = false;
          }, 2000);
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch((err) => console.error("Scanner clear error", err));
    };
  }, [eventId]);

  // ✅ Agar eventId nahi mila to error show karo
  if (!eventId) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        ❌ Event ID not found. Please navigate from Manage Events page.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Event Attendance Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scanner Component */}
        <div className="bg-white p-5 rounded-xl shadow-md border col-span-1">
          <h2 className="text-xl font-semibold mb-4">Scan Student QR</h2>
          <div id="reader"></div>

          {/* Success Message */}
          {successMsg && (
            <p className="text-green-600 mt-2 text-sm font-medium">{successMsg}</p>
          )}

          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-500 mt-2 text-sm font-medium">❌ {errorMsg}</p>
          )}
        </div>

        {/* Attendance Table Component */}
        <div className="bg-white p-5 rounded-xl shadow-md border col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            Live Attendance Roll ({attendanceList.length})
          </h2>
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
                {attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-slate-400">
                      No attendance marked yet. Scan a QR code to begin.
                    </td>
                  </tr>
                ) : (
                  attendanceList.map((student) => (
                    <tr
                      key={student._id || student.rollNumber}
                      className="hover:bg-slate-50"
                    >
                      <td className="p-3 border">{student.rollNumber}</td>
                      <td className="p-3 border">{student.studentName}</td>
                      <td className="p-3 border text-green-600 font-bold">
                        {student.status}
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
