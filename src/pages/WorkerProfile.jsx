import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
      ✅ Verified
    </div>
  );
}

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [worker, setWorker] = useState(null);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchWorkerProfile();
    fetchAcceptedJobs();
  }, [id]);

  const fetchWorkerProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/api/worker/worker/${id}`);
      const data = await response.json();

      if (response.ok) {
        setWorker({
          ...data.worker,
          rating: (4 + Math.random()).toFixed(1),
          jobsCompleted: Math.floor(Math.random() * 100) + 10,
          location: { address: "Bangalore, Karnataka" },
        });
      } else throw new Error("Worker not found");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAcceptedJobs = async () => {
    const mockJobs = [
      {
        _id: "1",
        customerName: "Priya Sharma",
        customerPhone: "+91 9876543210",
        customerAddress: "Koramangala, Bangalore",
        jobType: "Plumbing",
        description: "Fix leaking kitchen sink",
        status: "accepted",
        scheduledDate: "2025-10-30",
        scheduledTime: "10:00 AM",
        price: 1500,
      }
    ];
    setAcceptedJobs(mockJobs);
  };

  const getStatusBadge = (status) => {
    const styles = {
      accepted: "bg-blue-100 text-blue-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}>
        Loading...
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}>
        <p className="text-red-600">{error || "Worker not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}>
      
      {/* Simplified return for clarity */}
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">{worker.fullName}</h1>
        <p className="text-blue-600 font-medium">{worker.profession}</p>
      </div>

    </div>
  );
}
