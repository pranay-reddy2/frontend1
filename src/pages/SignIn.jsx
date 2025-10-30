import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";

function WrenchIcon() {
  return (
    <svg
      className="w-8 h-8 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M11.42 15.17l.02.02m-0.02-0.02l-6.16-6.16a2.652 2.652 0 00-3.75 3.75l6.16 6.16m3.75-3.75l.02.02M3.75 3.75l3.75 3.75m-3.75-3.75l3.75 3.75"
      />
    </svg>
  );
}

export default function SignIn() {
  const [userType, setUserType] = useState("worker");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const HARD_CODED_OTP = "123456";

  // Simulate OTP sending (no real SMS)
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return setError("Please enter a valid 10-digit mobile number");
    }

    // Simulate OTP sent
    console.log("📱 Sending OTP to:", mobile);
    setIsOtpSent(true);
    alert(`OTP sent to ${mobile} (use ${HARD_CODED_OTP} for testing)`);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (otp !== HARD_CODED_OTP) {
        throw new Error("Invalid OTP. Try again.");
      }

      // Simulated backend login (or use fetch if backend ready)
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mobile,
          otp,
          role: userType,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "worker") {
        navigate("/worker-profile/:id");
      } else {
        navigate("/worker-page");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const getTabClass = (type) =>
    `flex-1 py-3 text-center rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
      userType === type
        ? "bg-blue-600 text-white shadow-md"
        : "bg-transparent text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
            <WrenchIcon />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ServiceHub</h1>
          <p className="text-gray-500 mt-2">
            Connect with skilled workers or find customers
          </p>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          <button
            className={getTabClass("worker")}
            onClick={() => setUserType("worker")}
          >
            Worker
          </button>
          <button
            className={getTabClass("customer")}
            onClick={() => setUserType("customer")}
          >
            Customer
          </button>
        </div>

        {!isOtpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 10-digit mobile number"
                required
                pattern="[0-9]{10}"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg py-2 px-4 mb-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter OTP (123456)"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg py-2 px-4 mb-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 rounded-lg font-semibold text-lg transition-colors ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp("");
                }}
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Change mobile number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
