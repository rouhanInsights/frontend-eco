"use client";
import { useState ,useEffect} from "react";

const OtpLogin = () => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("phone"); // 'phone' or 'email'
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async () => {
    try {
      const payload = method === "phone" ? { phone: value } : { email: value };
      const res = await fetch("http://localhost:5000/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error);
      setMessage("✅ OTP sent successfully.");
      setStep(2);
    } catch (err) {
      setError("❌ Error sending OTP");
    }
  };
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const verifyOtp = async () => {
    try {
      const payload =
        method === "phone"
          ? { phone: value, otp_code: otp }
          : { email: value, otp_code: otp };

      const res = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("🎉 Logged in successfully!");
      window.location.href = "/";
    } catch (err) {
      setError("❌ OTP verification failed");
    }
  };

  const toggleMethod = () => {
    setMethod(method === "phone" ? "email" : "phone");
    setValue("");
    setStep(1);
    setMessage("");
    setError("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">🔐 OTP Login</h2>

        <button
          onClick={toggleMethod}
          className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Switch to {method === "phone" ? "Email" : "Phone"} Login
        </button>

        {step === 1 ? (
          <>
            <input
              type={method === "phone" ? "tel" : "email"}
              placeholder={`Enter ${method}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-4 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              onClick={sendOtp}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <p className="mt-4 text-gray-600 text-center">
              OTP sent to {method}: <strong>{value}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-4 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              onClick={verifyOtp}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Verify OTP
            </button>
          </>
        )}
        {step === 2 && countdown > 0 && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            You can resend OTP in {countdown}s
          </p>
        )}

        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default OtpLogin;
