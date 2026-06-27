import { useParams } from "react-router-dom";
import api from '../../../services/api';

const AttendanceMark = () => {
  const { eventId } = useParams();

  const markAttendance = async () => {
    try {
      const response = await api.post('/attendance/mark', {
        eventId,
        studentId: "STUDENT001",
      });

      alert(response.data.message);
    } catch (error) {
      alert("Failed to mark attendance");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-6">
        Event Attendance
      </h2>

      <p className="mb-4">
        Event ID: {eventId}
      </p>

      <button
        onClick={markAttendance}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
      >
        Confirm Attendance
      </button>
    </div>
  );
};

export default AttendanceMark;