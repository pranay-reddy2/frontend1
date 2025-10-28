import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Using the original background image
import backgroundImage from "../assets/background.jpg"; 

// --- Icon Components (Keeping the refined versions) ---

function SearchIcon({ className = "text-gray-400" }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function LocationIcon({ className = "text-gray-500" }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function StarIcon({ filled }) {
  return (
    <svg className="w-4 h-4 transition-transform duration-150" fill={filled ? "#FFC72C" : "none"} stroke={filled ? "#FFC72C" : "currentColor"} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={filled ? 0 : 2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-300 transform hover:scale-105 transition">
      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Guaranteed
    </div>
  );
}


// --- Main Component ---

export default function SearchWorkers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedProfession, setSelectedProfession] = useState("all");

  const navigate = useNavigate();

  // Popular professions
  const professions = [
    "All",
    "Plumber",
    "Electrician",
    "Carpenter",
    "Painter",
    "Mason",
    "AC Technician",
    "Mechanic",
    "Cleaner",
    "Gardner",
  ];

  // --- Utility Functions (Mock location data added for immediate use) ---

  useEffect(() => {
    // Mock user location for demo
    setUserLocation({ lat: 12.9716, lng: 77.5946, address: "Whitefield, Bangalore" });
    fetchWorkers();
  }, []);

  useEffect(() => {
    filterWorkers();
  }, [searchQuery, selectedProfession, workers, userLocation]);

  const getUserLocation = async () => {
    // Implementation of Geolocation API would go here
  };

  const fetchWorkers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/api/worker/workers");
      const data = await response.json();

      if (response.ok) {
        const mockData = [
          { _id: '1', fullName: "Ramesh Kumar", profession: "Plumber", skills: ["Pipe Repair", "Faucets", "Drain Cleaning"], profileImageUrl: null, verified: true, experience: "5 years" },
          { _id: '2', fullName: "Sunita Devi", profession: "Electrician", skills: ["Wiring", "Installation", "Lighting"], profileImageUrl: null, verified: false, experience: "8 years" },
          { _id: '3', fullName: "John Doe", profession: "Carpenter", skills: ["Furniture", "Cabinetry", "Flooring"], profileImageUrl: null, verified: true, experience: "12 years" },
          { _id: '4', fullName: "Arif Khan", profession: "Painter", skills: ["Interior", "Exterior", "Texture"], profileImageUrl: null, verified: true, experience: "3 years" },
          { _id: '5', fullName: "Deepa Singh", profession: "AC Technician", skills: ["Split AC", "Window AC", "Gas Refill"], profileImageUrl: null, verified: false, experience: "6 years" },
        ];
        
        const workersWithLocation = (data.workers || mockData).map((worker) => ({
          ...worker,
          location: {
            lat: 12.9716 + (Math.random() - 0.5) * 0.1,
            lng: 77.5946 + (Math.random() - 0.5) * 0.1,
            address: "Bangalore, Karnataka",
          },
          rating: (4 + Math.random()).toFixed(1),
          jobsCompleted: Math.floor(Math.random() * 100) + 10,
          verified: Math.random() > 0.5,
          experience: `${Math.floor(Math.random() * 8) + 1} years`,
          skills: worker.skills || ["General Repair", "Basic Maintenance"],
        }));
        setWorkers(workersWithLocation);
      } else {
        throw new Error("Failed to fetch workers");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filterWorkers = () => {
    let filtered = [...workers];

    // Filter by profession
    if (selectedProfession !== "all") {
      filtered = filtered.filter(
        (worker) =>
          worker.profession?.toLowerCase() === selectedProfession.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (worker) =>
          worker.fullName?.toLowerCase().includes(query) ||
          worker.profession?.toLowerCase().includes(query) ||
          worker.skills?.some((skill) =>
            skill.toLowerCase().includes(query)
          )
      );
    }

    // Calculate distance and sort by nearest
    if (userLocation) {
      filtered = filtered.map((worker) => ({
        ...worker,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          worker.location.lat,
          worker.location.lng
        ),
      }));
      filtered.sort((a, b) => a.distance - b.distance);
    }

    setFilteredWorkers(filtered);
  };

  const handleWorkerClick = (workerId) => {
    navigate(`/worker-profile/${workerId}`);
  };

  // --- UI Rendering with Original Background and High Polish ---

  return (
    <div
      className="min-h-screen p-4 md:p-8 pb-20"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Reverted to original background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto"> 
        
        {/* Header and Search - Unified Card with white, high-contrast background */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border-b-8 border-blue-500/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
              <span role="img" aria-label="Find Worker">🔍</span> Find Experts
            </h1>
            <button
              onClick={() => navigate("/customer-home")}
              className="text-gray-500 hover:text-red-600 transition duration-300 p-2 rounded-full bg-gray-100 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
              aria-label="Go back to home"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar - Advanced focus state */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <SearchIcon className="text-blue-500 transition-colors duration-200" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg placeholder-gray-500 focus:ring-4 focus:ring-blue-200/50 focus:border-blue-500 transition-all duration-300 shadow-inner hover:shadow-md"
              placeholder="Search by name, Plumber, or skill..."
            />
          </div>

          {/* Location Info - Actionable and clear */}
          {userLocation && (
            <div className="flex items-center justify-between text-md text-blue-700 font-semibold mt-4 bg-blue-50 p-3 rounded-xl border border-blue-200 shadow-inner">
              <div className="flex items-center gap-2">
                <LocationIcon className="w-6 h-6 text-blue-600" />
                <span>
                  Searching near: **{userLocation.address || "Your Location"}**
                </span>
              </div>
              <button className="text-sm font-medium text-blue-500 hover:text-blue-600 transition duration-150 p-1 rounded-md hover:bg-blue-100/50">
                Change Location
              </button>
            </div>
          )}
        </div>

        {/* Profession Filter - Sticky and refined */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-8 sticky top-0 z-20 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-900 mb-3 border-l-4 border-blue-500 pl-3">Popular Services</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {professions.map((profession) => (
              <button
                key={profession}
                onClick={() => setSelectedProfession(profession.toLowerCase())}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all duration-300 shadow-md ${
                  selectedProfession === profession.toLowerCase()
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-blue-400/70 scale-[1.03] ring-2 ring-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                }`}
              >
                {profession}
              </button>
            ))}
          </div>
        </div>

        {/* Workers List & Status */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-t-4 border-blue-500">
            <div className="animate-pulse rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-2xl font-bold text-gray-800">Searching the Network...</p>
            <p className="text-gray-500 mt-2">Connecting to verified service providers nearby.</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-400 rounded-2xl shadow-xl p-8 text-center">
            <p className="text-red-700 text-xl font-bold mb-4">🚨 Connection Error</p>
            <p className="text-red-500">Failed to fetch worker data. Please try again or check your API status.</p>
            <button
              onClick={fetchWorkers}
              className="mt-6 bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition duration-300 shadow-lg shadow-red-300/50"
            >
              <span role="img" aria-label="Refresh">🔄</span> Reconnect
            </button>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-t-4 border-gray-300">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m2.828 2.828l-3.536 3.536m-7.072 0l3.536-3.536m-2.828-2.828l3.536-3.536M12 21a9 9 0 100-18 9 9 0 000 18z" />
            </svg>
            <p className="text-gray-700 text-2xl font-bold mb-2">Nobody matches your request</p>
            <p className="text-gray-500 text-md">Try searching for a different skill or a broader profession.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 sticky top-20 z-10 shadow-md">
              <p className="text-lg font-bold text-gray-800">
                <span className="mr-2 text-blue-600">✅</span> **{filteredWorkers.length}** Experts Found
              </p>
              <p className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
                Sorted: **Nearest to You**
              </p>
            </div>

            {/* Worker Card List */}
            {filteredWorkers.map((worker) => (
              <div
                key={worker._id}
                onClick={() => handleWorkerClick(worker._id)}
                className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:ring-4 hover:ring-blue-100 transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer group relative"
              >
                <div className="flex items-start gap-6">
                  {/* Profile Image with subtle hover effect */}
                  <div className="flex-shrink-0">
                    {worker.profileImageUrl ? (
                      <img
                        src={worker.profileImageUrl}
                        alt={worker.fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/80 shadow-lg group-hover:border-blue-700 transition"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-500/80 shadow-lg">
                        <span className="text-4xl font-extrabold text-blue-600">
                          {worker.fullName?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Worker Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-extrabold text-gray-900 leading-tight">
                          {worker.fullName}
                        </h3>
                        {/* Profession as a bold, color-coded chip */}
                        <span className="inline-block bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mt-1 shadow-md shadow-blue-200/50">
                          {worker.profession}
                        </span>
                      </div>
                      {worker.verified && <VerifiedBadge />}
                    </div>

                    {/* Key Stats - Segmented and clear */}
                    <div className="flex items-center gap-4 flex-wrap mb-3 text-sm pt-2 border-t border-gray-100 mt-2">
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                        <span className="text-xl text-[#FFC72C] mr-1">★</span>
                        **{worker.rating}**
                        <span className="text-gray-500 font-normal">/ 5.0</span>
                      </div>

                      {/* Distance - Primary Callout */}
                      {worker.distance && (
                        <div className="flex items-center gap-1 text-green-700 font-bold">
                          <LocationIcon className="w-4 h-4 text-green-500" />
                          <span className="text-md">
                            **{worker.distance.toFixed(1)} km**
                          </span>
                        </div>
                      )}
                      
                      {/* Secondary Stats */}
                      <span className="text-sm text-gray-600 font-medium">
                        | <span className="font-bold">{worker.jobsCompleted}</span> Jobs
                      </span>
                      <span className="text-sm text-gray-600 font-medium">
                        | <span className="font-bold">{worker.experience}</span> Exp.
                      </span>
                    </div>

                    {/* Skills - Subtle, rounded tags with emphasis on the primary skill */}
                    {worker.skills && worker.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {worker.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                                index === 0 
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                        {worker.skills.length > 4 && (
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            +{worker.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* CTA Overlay for clarity on click action */}
                <div className="absolute inset-0 bg-transparent flex items-center justify-end pr-6 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl flex items-center gap-2">
                        View Profile <span className="text-lg">→</span>
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}