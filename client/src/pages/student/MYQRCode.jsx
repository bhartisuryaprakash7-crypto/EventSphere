import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import API from "../../services/eventService";

function MyQRCode() {

  const { eventId } = useParams();

  const [qrData, setQrData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadQR = async () => {

      try {

        // Logged in user

        const user = JSON.parse(localStorage.getItem("user"));

        // Find student's registration

        const res = await API.get("/registrations/mine");

        const registration = res.data.find(

          (item) => item.event._id === eventId

        );

        if (!registration) {

          alert("You are not registered for this event.");

          return;

        }

        const qr = {

          studentId: user._id,

          registrationId: registration._id,

          eventId,

          studentName: user.name,

          rollNumber: user.rollNumber,

        };

        setQrData(qr);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    loadQR();

  }, [eventId]);

  if (loading) {

    return (
      <div className="p-10 text-center">
        Loading QR...
      </div>
    );

  }

  return (

    <div className="max-w-lg mx-auto mt-10">

      <div className="bg-white rounded-xl shadow-lg p-8 text-center">

        <h1 className="text-3xl font-bold mb-6">

          My Attendance QR

        </h1>

        {qrData ? (

          <>

            <QRCodeCanvas

              value={JSON.stringify(qrData)}

              size={280}

            />

            <p className="mt-6 font-semibold">

              {qrData.studentName}

            </p>

            <p className="text-slate-500">

              {qrData.rollNumber}

            </p>

          </>

        ) : (

          <p>

            QR Code Not Available

          </p>

        )}

      </div>

    </div>

  );

}

export default MyQRCode;