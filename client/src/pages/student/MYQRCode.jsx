import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

import { saveAttendance, fetchAttendanceByEvent } from "../../services/attendanceService";

function MyQRCode() {

  const { eventId } = useParams();

  const [token, setToken] =
    useState("");

  useEffect(() => {

    const fetchQR = async () => {

      try {

        const res =
          await attendanceService
            .getQRCode(eventId);

        setToken(
          res.data.token
        );

      } catch (error) {

        console.log(error);

      }
    };

    fetchQR();

  }, [eventId]);

  return (

    <div className="p-6">

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-5">
          My Attendance QR
        </h2>

        {token ? (

          <QRCodeCanvas
            value={token}
            size={250}
          />

        ) : (

          <p>Loading QR...</p>

        )}

      </div>

    </div>

  );
}

export default MyQRCode;