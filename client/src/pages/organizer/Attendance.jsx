import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  saveAttendance,
  fetchAttendanceByEvent,
} from "../../services/attendanceService";

function OrganizerAttendance() {
  const { eventId } = useParams();

  const [attendanceList, setAttendanceList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isScanning = useRef(false);

  // ===========================
  // Fetch Attendance List
  // ===========================
  useEffect(() => {
    if (!eventId) return;

    const loadAttendance = async () => {
      try {
        const res = await fetchAttendanceByEvent(eventId);

        if (res.success) {
          setAttendanceList(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadAttendance();
  }, [eventId]);

  // ===========================
  // QR Scanner
  // ===========================
  useEffect(() => {
    if (!eventId) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (isScanning.current) return;

        isScanning.current = true;

        try {
          let qrData;

          // Try JSON QR
          try {
            qrData = JSON.parse(decodedText);
          } catch {
            // Old Format QR
            const [rollNumber, studentName] = decodedText.split("|");

            qrData = {
              rollNumber,
              studentName,
            };
          }

          if (!qrData.rollNumber || !qrData.studentName) {
            throw new Error("Invalid QR Code");
          }

          const response = await saveAttendance({
            eventId,
            studentId: qrData.studentId,
            registrationId: qrData.registrationId,
            rollNumber: qrData.rollNumber,
            studentName: qrData.studentName,
          });

          if (response.success) {
            setAttendanceList((prev) => {
              const alreadyExists = prev.find(
                (item) => item.rollNumber === qrData.rollNumber
              );

              if (alreadyExists) return prev;

              return [...prev, response.data];
            });

            setSuccessMsg(
              `✅ ${qrData.studentName} (${qrData.rollNumber}) Attendance Marked`
            );

            setErrorMsg("");

            setTimeout(() => {
              setSuccessMsg("");
            }, 3000);
          }
        } catch (err) {
          console.log(err);

          setSuccessMsg("");

          setErrorMsg(
            err.response?.data?.message ||
              err.message ||
              "Attendance Failed"
          );

          setTimeout(() => {
            setErrorMsg("");
          }, 3000);
        } finally {
          setTimeout(() => {
            isScanning.current = false;
          }, 2000);
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [eventId]);

  if (!eventId) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Event ID Not Found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold text-center mb-8">
        Event Attendance Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* QR Scanner */}

        <div className="bg-white rounded-xl shadow p-5 border">

          <h2 className="text-xl font-semibold mb-4">
            Scan Student QR
          </h2>

          <div id="reader"></div>

          {successMsg && (
            <div className="mt-4 text-green-600 font-semibold">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 text-red-600 font-semibold">
              {errorMsg}
            </div>
          )}

        </div>

        {/* Attendance Table */}

        <div className="bg-white rounded-xl shadow p-5 border md:col-span-2">

          <h2 className="text-xl font-semibold mb-4">
            Live Attendance ({attendanceList.length})
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-blue-600 text-white">

                  <th className="p-3 border">
                    Roll Number
                  </th>

                  <th className="p-3 border">
                    Student Name
                  </th>

                  <th className="p-3 border">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {attendanceList.length === 0 ? (

                  <tr>

                    <td
                      colSpan="3"
                      className="text-center p-6 text-slate-400"
                    >
                      No Attendance Yet
                    </td>

                  </tr>

                ) : (

                  attendanceList.map((student) => (

                    <tr
                      key={student._id}
                      className="hover:bg-slate-50"
                    >

                      <td className="border p-3">
                        {student.rollNumber}
                      </td>

                      <td className="border p-3">
                        {student.studentName}
                      </td>

                      <td className="border p-3 text-green-600 font-bold">
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