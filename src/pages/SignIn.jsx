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
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!/^\+?[0-9]{10,13}$/.test(mobileNumber.replace(/\s/g, ""))) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowOTP(true);
      console.log("OTP sent!");
    }, 2000);
  };

  const verifyOTP = () => {
    if (otp.length !== 6) {
      setError("Invalid OTP! Enter 6 digits");
      return;
    }
    console.log("OTP Verified!");
    // After OTP verification
    if (userType === "worker") {
      navigate("/worker-profile");
    } else {
      navigate("/customer-home");
    } // ✅ Redirect after login success
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

        {!showOTP ? (
          <>
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

            <form onSubmit={handleSubmit}>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+91 9876543210"
                required
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Include country code (e.g., +91)
              </p>

              {error && (
                <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg py-2 px-4 mt-4 text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-5 text-white py-3 rounded-lg font-semibold text-lg ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-center mb-4">
              Enter OTP
            </h3>
            <p className="text-gray-600 text-center mb-3">
              OTP sent to {mobileNumber}
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-3 rounded-lg text-center text-xl tracking-widest"
              placeholder="123456"
            />

            {error && (
              <p className="text-red-500 text-sm text-center mt-3">{error}</p>
            )}

            <button
              onClick={verifyOTP}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mt-5"
            >
              Verify OTP
            </button>
          </>
        )}

        <div className="flex justify-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
