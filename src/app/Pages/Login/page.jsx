"use client";
import { useState } from "react";
import Link from "next/link";

const Login = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const sendOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneOrEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setIsOtpSent(true);
        alert("OTP sent!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneOrEmail, otp, token }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("authToken", data.authToken);
        setIsVerified(true);
        alert("Login Successful!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 shadow-lg rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">{isVerified ? "Welcome!" : "Login"}</h2>
      
      {!isOtpSent ? (
        <div>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Enter Email or Phone"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
          />
          <button className="bg-blue-500 text-white w-full py-2 mt-4" onClick={sendOtp}>
            Send OTP
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="bg-green-500 text-white w-full py-2 mt-4" onClick={verifyOtp}>
            Verify OTP
          </button>
        </div>
      )}
       {/* ✅ Use Link for Navigation After Login */}
          {isVerified && (
            <Link href="/">
              <button style={{ marginLeft: "10px", backgroundColor: "green", color: "white", padding: "10px" }}>
                Go to Home
              </button>
            </Link>
          )}
    </div>
  );
};

export default Login;
