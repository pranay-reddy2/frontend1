import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CustomerViewWorker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch worker details when ID changes
  useEffect(() => {
    fetchWorkerDetails();
  }, [id]);

  const fetchWorkerDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8080/api/worker/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load worker profile");
      }

      // In case API structure differs
      setWorker(data.worker || data);
    } catch (err) {
      console.error("Error loading worker:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHireClick = () => {
    alert(`Hire request sent to ${worker.fullName}!`);
    // later: POST /api/request with customer + worker IDs
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Loading worker details...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-600 font-semibold text-xl mb-4">
          Error: {error}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );

  if (!worker)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Worker not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-t-8 border-blue-500">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Worker Profile
          </h1>
          <div></div>
        </div>

        {/* Profile Info */}
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            {worker.profileImageUrl ? (
              <img
                src={worker.profileImageUrl}
                alt={worker.fullName}
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-400 shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-400 shadow-lg">
                <span className="text-5xl font-bold text-blue-700">
                  {worker.fullName?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {worker.fullName}
            </h2>
            <p className="text-blue-600 font-semibold text-lg mb-3">
              {worker.profession || "Professional Worker"}
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              {worker.bio ||
                "Reliable and skilled professional available for service requests. Contact for quick and quality work."}
            </p>

            <div className="flex flex-wrap gap-3 text-gray-700 text-sm">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                ⭐ {worker.rating?.average || worker.rating || "4.5"} / 5
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {worker.experience || "2 years"} experience
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {worker.jobsCompleted || "20"} jobs completed
              </span>
              {worker.verified && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  ✅ Verified
                </span>
              )}
            </div>

            {worker.skills?.length > 0 && (
              <div className="mt-5">
                <h3 className="font-semibold text-gray-800 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact + Hire */}
        <div className="p-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-700 text-center md:text-left">
            <h3 className="font-semibold text-gray-900 mb-1">Contact Info</h3>
            <p>{worker.contactNumber || "Not provided"}</p>
            <p>{worker.email || "Email not available"}</p>
            {worker.location && (
              <p className="text-sm text-gray-500 mt-1">📍 {worker.location}</p>
            )}
          </div>

          <button
            onClick={handleHireClick}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-105"
          >
            Hire Now
          </button>
        </div>
      </div>
    </div>
  );
}
