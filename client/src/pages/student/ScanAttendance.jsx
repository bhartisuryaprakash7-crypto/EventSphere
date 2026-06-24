import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const ScanAttendance = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        window.location.href = decodedText;
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">
        Scan Attendance QR
      </h1>

      <div
        id="reader"
        className="w-full max-w-md"
      ></div>
    </div>
  );
};

export default ScanAttendance;