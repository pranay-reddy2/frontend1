import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";

export default function SignUp() {
  const [userType, setUserType] = useState("worker");
  const [formData, setFormData] = useState({
    fullName: "",
    profession: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^\+?[0-9]{10,13}$/.test(formData.mobileNumber)) {
      setError("Enter a valid mobile number!");
      return;
    }

    if (userType === "customer" && (!formData.email || !formData.password)) {
      setError("Email & Password required for Customers!");
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowOTP(true);
      console.log("OTP sent to:", formData.mobileNumber);
    }, 2000);
  };

  const verifyOTP = () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setError(null);
    console.log("OTP Verified:", otp);
    // After OTP verification
    if (userType === "worker") {
      navigate("/worker-home");
    } else {
      navigate("/customer-home");
    } // ✅ Redirect after successful OTP
  };

  const tabClass = (type) =>
    `flex-1 py-2 rounded-lg text-center cursor-pointer transition ${
      userType === type
        ? "bg-blue-600 text-white shadow-md"
        : "bg-gray-200 text-gray-700"
    }`;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gray-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        {/* ✅ If OTP screen not shown → show full form */}
        {!showOTP ? (
          <>
            {/* Toggle User Type */}
            <div className="flex gap-2 mb-6 bg-gray-200 p-1 rounded-xl">
              <button
                className={tabClass("worker")}
                onClick={() => setUserType("worker")}
              >
                Worker
              </button>
              <button
                className={tabClass("customer")}
                onClick={() => setUserType("customer")}
              >
                Customer
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {userType === "worker" && (
                <>
                  <div className="mb-4">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium">Profession</label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1"
                      placeholder="Plumber, Electrician..."
                      required
                    />
                  </div>
                </>
              )}

              {userType === "customer" && (
                <>
                  <div className="mb-4">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1"
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg mt-1"
                      placeholder="•••••••"
                      required
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="text-sm font-medium">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg mt-1"
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-3 rounded-lg text-lg font-semibold ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Sending OTP..." : "Signup"}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* ✅ OTP Verification UI */}
            <h3 className="text-xl font-semibold text-center mb-4">
              Verify OTP
            </h3>
            <p className="text-gray-600 text-center mb-3">
              OTP sent to {formData.mobileNumber}
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

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
