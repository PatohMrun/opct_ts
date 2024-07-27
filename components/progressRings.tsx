"use client";

import { FaCheck } from "react-icons/fa6";
import { FaHourglassEnd } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { getUser } from "@/utils/auth";
import { useEffect, useState } from "react";

type Status = "Pending" | "Approved" | "Rejected";

const ProgressRings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [hasApplied, setHasApplied] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  async function fetchApplicationStatus() {
    setLoading(true);
    try {
      const currentUser = getUser()!;
      const userId = currentUser.id;
      const url = `/api/applications/user?userId=${userId}`;
      const response = await fetch(url);
      if (response.status === 404) {
        setHasApplied(false);
        setStatus(null);
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (data.status) {
        setStatus(data.status);
      } else {
        console.error(data.error);
        setError("Failed to fetch application status");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white m-4 rounded-lg p-6 shadow-lg">
      <h1 className="text-center uppercase font-poppins font-bold text-xl my-4">Application Status</h1>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}

      <div className="text-center py-4">
        {hasApplied && !loading && !error && (
          <div className={`text-lg font-semibold ${status === "Rejected" ? "text-red-500" : status === "Approved" ? "text-green-500" : "text-blue-500"}`}>
            {status === "Pending" && "Your application is currently pending."}
            {status === "Approved" && "Congratulations! Your application has been approved."}
            {status === "Rejected" && "Sorry, your application has been rejected."}
          </div>
        )}

        {!hasApplied && !loading && !error && (
          <div className="text-gray-500 text-center py-4">
            You have not applied yet.
          </div>
        )}
      </div>

      <section className="font-poppins flex flex-col sm:flex-row justify-center items-center gap-6">
        {/* Ring one */}
        <div className={`flex flex-col items-center gap-2 ${status === "Pending" ? "opacity-100" : "opacity-50"}`}>
          <div className={`bg-green-500 rounded-full flex justify-center items-center w-16 h-16 ${status === "Pending" ? "border-4 border-blue-600" : ""}`}>
            <FaCheck size={28} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Application Submitted</h3>
            {status === "Pending" && <p className="text-sm text-blue-600">You are here</p>}
          </div>
        </div>
        <hr className={`w-16 sm:w-24 border-black transform rotate-90 sm:transform-none ${status === "Approved" ? "border-blue-600" : ""}`} />
        {/* Ring two */}
        <div className={`flex flex-col items-center gap-2 ${status === "Approved" ? "opacity-100" : "opacity-50"}`}>
          <div className={`bg-yellow-500 rounded-full flex justify-center items-center w-16 h-16 ${status === "Approved" ? "border-4 border-blue-600" : ""}`}>
            <FaHourglassEnd size={28} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">In Review</h3>
            {status === "Approved" && <p className="text-sm text-blue-600">You are here</p>}
          </div>
        </div>
        <hr className={`w-16 sm:w-24 border-black transform rotate-90 sm:transform-none ${status === "Rejected" ? "border-blue-600" : ""}`} />
        {/* Ring three */}
        <div className={`flex flex-col items-center gap-2 ${status === "Rejected" ? "opacity-100" : "opacity-50"}`}>
          <div className={`bg-gray-500 rounded-full flex justify-center items-center w-16 h-16 ${status === "Rejected" ? "border-4 border-blue-600" : ""}`}>
            <IoMdTime size={28} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Approved or Rejected</h3>
            {status === "Rejected" && <p className="text-sm text-blue-600">You are here</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgressRings;
