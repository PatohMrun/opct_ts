"use client";

import React, { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export type ApprovedPerson = {
  id: number;
  name: string;
  nationalId: string;
  bankDetails: string;
  alternatePayerBankDetails: string;
};

export type NotApprovedPerson = {
  id: number;
  name: string;
  nationalId: string;
  email: string;
  deathCertNo: string;
};

export type PendingApprovalPerson = {
  id: number;
  name: string;
  nationalId: string;
  applicationDate: string;
};

const EligibleNotEligiblePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "approved" | "notApproved" | "pendingApproval"
  >("approved");

  const [approvedData, setApprovedData] = useState<ApprovedPerson[]>([]);
  const [notApprovedData, setNotApprovedData] = useState<NotApprovedPerson[]>(
    []
  );
  const [pendingApprovalData, setPendingApprovalData] = useState<
    PendingApprovalPerson[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const url = "/api/export-data";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const json = await res.json();
      const { approved, rejected, pending } = json;

      // alert(JSON.stringify(json));

      setApprovedData(approved);
      setNotApprovedData(rejected);
      setPendingApprovalData(pending);
    } catch (err) {
      setError(`Could not fetch data. Please retry!`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const downloadData = (data: object[], filename: string) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Export Data</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveTab("approved")}
          className={`py-2 px-4 ${
            activeTab === "approved"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          } focus:outline-none`}
        >
          Approved
        </button>
        <button
          onClick={() => setActiveTab("notApproved")}
          className={`py-2 px-4 ${
            activeTab === "notApproved"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          } focus:outline-none`}
        >
          Rejected
        </button>
        <button
          onClick={() => setActiveTab("pendingApproval")}
          className={`py-2 px-4 ${
            activeTab === "pendingApproval"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          } focus:outline-none`}
        >
          Pending
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {/* Content */}
      {activeTab === "approved" && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Approved Individuals</h2>
          {approvedData.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                      <th className="py-3 px-4 border-b">Name</th>
                      <th className="py-3 px-4 border-b">National ID</th>
                      <th className="py-3 px-4 border-b">Bank Details</th>
                      <th className="py-3 px-4 border-b">
                        Alternate Payer Bank Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedData.map((person) => (
                      <tr key={person.id} className="hover:bg-gray-100">
                        <td className="py-3 px-4 border-b">{person.name}</td>
                        <td className="py-3 px-4 border-b">
                          {person.nationalId}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {person.bankDetails}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {person.alternatePayerBankDetails}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      alert("Funds disbursed successfully!");

                      setLoading(false);
                    }, 3000);
                  }}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 mr-4"
                >
                  Disburse Funds
                </button>
                <button
                  onClick={() =>
                    downloadData(approvedData, "approved_individuals")
                  }
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                >
                  Download
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No approved individuals to display.</p>
          )}
        </div>
      )}

      {activeTab === "notApproved" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Not Approved Individuals
          </h2>
          {notApprovedData.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                      <th className="py-3 px-4 border-b">Name</th>
                      <th className="py-3 px-4 border-b">National ID</th>
                      <th className="py-3 px-4 border-b">Email</th>
                      <th className="py-3 px-4 border-b">
                        Death Certificate No.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {notApprovedData.map((person) => (
                      <tr key={person.id} className="hover:bg-gray-100">
                        <td className="py-3 px-4 border-b">{person.name}</td>
                        <td className="py-3 px-4 border-b">
                          {person.nationalId}
                        </td>
                        <td className="py-3 px-4 border-b">{person.email}</td>
                        <td className="py-3 px-4 border-b">
                          {person.deathCertNo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() =>
                    downloadData(notApprovedData, "not_approved_individuals")
                  }
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                >
                  Download
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              No not approved individuals to display.
            </p>
          )}
        </div>
      )}

      {activeTab === "pendingApproval" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Approval</h2>
          {pendingApprovalData.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                      <th className="py-3 px-4 border-b">Name</th>
                      <th className="py-3 px-4 border-b">National ID</th>
                      <th className="py-3 px-4 border-b">Application Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovalData.map((person) => (
                      <tr key={person.id} className="hover:bg-gray-100">
                        <td className="py-3 px-4 border-b">{person.name}</td>
                        <td className="py-3 px-4 border-b">
                          {person.nationalId}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {person.applicationDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() =>
                    downloadData(
                      pendingApprovalData,
                      "pending_approval_individuals"
                    )
                  }
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                >
                  Download
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              No pending approval individuals to display.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EligibleNotEligiblePage;
