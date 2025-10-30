// src/pages/WorkerProfile.jsx - Complete Worker Profile Page
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  API_ENDPOINTS,
  fetchWithAuth,
  getAuthToken,
  getUserData,
} from "../config/api";
import backgroundImage from "../assets/background.jpg";

function StarIcon({ filled }) {
  return (
    <svg
      className="w-5 h-5"
      fill={filled ? "#FFC72C" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUserData();

  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid worker ID");
      setIsLoading(false);
      return;
    }
    fetchWorkerProfile();
  }, [id]);

  const fetchWorkerProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/worker/worker/${id}`
      );
      const data = await response.json();

      if (response.ok) {
        setWorker(data.worker);
        // Check if current user owns this profile
        if (currentUser && data.worker.createdBy === currentUser.id) {
          setIsOwner(true);
        }
      } else {
        throw new Error(data.error || "Worker not found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate(`/worker-home?edit=${id}`);
  };

  const handleContact = () => {
    if (!getAuthToken()) {
      alert("Please login to contact this worker");
      navigate("/");
      return;
    }
    alert(`Contact: ${worker.fullName}`);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-gray-700 mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/worker-page")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            {isOwner && (
              <button
                onClick={handleEditProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {worker.profileImageUrl ? (
                <img
                  src={worker.profileImageUrl}
                  alt={worker.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-500 shadow-lg">
                  <span className="text-5xl font-bold text-blue-600">
                    {worker.fullName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Worker Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {worker.fullName}
                  </h1>
                  <p className="text-xl text-blue-600 font-semibold mt-1">
                    {worker.profession}
                  </p>
                </div>
                {worker.verified && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ✅ Verified
                  </div>
                )}
              </div>

              {/* Rating & Stats */}
              <div className="flex items-center gap-6 my-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} filled={i <= 4} />
                  ))}
                  <span className="ml-2 text-gray-700 font-bold">4.5</span>
                </div>
                <span className="text-gray-600">•</span>
                <span className="text-gray-700 font-medium">
                  50+ Jobs Completed
                </span>
              </div>

              {/* Experience */}
              {worker.experience && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Experience
                  </h3>
                  <p className="text-gray-700">{worker.experience}</p>
                </div>
              )}

              {/* Skills */}
              {worker.skills && worker.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Button */}
          {!isOwner && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleContact}
                className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Contact Worker
              </button>
            </div>
          )}
        </div>

        {/* Endorsements Section */}
        {worker.endorsements && worker.endorsements.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Endorsements
            </h2>
            <div className="space-y-4">
              {worker.endorsements
                .filter((e) => e.accepted)
                .map((endorsement, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 mb-2">"{endorsement.text}"</p>
                    <p className="text-sm text-gray-500">
                      — {endorsement.endorserName}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
