"use client"

import React, { useState } from "react";

const EligibleNotEligiblePage = () => {
  const [activeTab, setActiveTab] = useState("approved");

  const approvedData = [
    {
      id: 1,
      name: "John Doe",
      nationalId: "12345678",
      bankDetails: "Bank of Kenya, Account No: 987654321",
      alternatePayerBankDetails: "ABC Bank, Account No: 123456789",
    },
    {
      id: 2,
      name: "Jane Smith",
      nationalId: "87654321",
      bankDetails: "National Bank, Account No: 123456789",
      alternatePayerBankDetails: "XYZ Bank, Account No: 987654321",
    },
    // Add more approved data here
  ];

  const notApprovedData = [
    {
      id: 1,
      name: "Alice Johnson",
      nationalId: "11223344",
      email: "alice@example.com",
      deathCertNo: "DC12345",
    },
    {
      id: 2,
      name: "Bob Brown",
      nationalId: "44332211",
      email: "bob@example.com",
      deathCertNo: "DC54321",
    },
    // Add more not approved data here
  ];

  const downloadData = (data, filename) => {
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
      <h1 className="text-2xl font-bold text-center mb-8">OPCT Eligibility Status</h1>

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
          Approved Individuals
        </button>
        <button
          onClick={() => setActiveTab("notApproved")}
          className={`py-2 px-4 ${
            activeTab === "notApproved"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          } focus:outline-none`}
        >
          Not Approved Individuals
        </button>
      </div>

      {/* Content */}
      {activeTab === "approved" && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Approved Individuals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                  <th className="py-3 px-4 border-b">Name</th>
                  <th className="py-3 px-4 border-b">National ID</th>
                  <th className="py-3 px-4 border-b">Bank Details</th>
                  <th className="py-3 px-4 border-b">Alternate Payer Bank Details</th>
                </tr>
              </thead>
              <tbody>
                {approvedData.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b">{person.name}</td>
                    <td className="py-3 px-4 border-b">{person.nationalId}</td>
                    <td className="py-3 px-4 border-b">{person.bankDetails}</td>
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
              onClick={() => downloadData(approvedData, "approved_individuals")}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
            >
              Download Approved Data
            </button>
          </div>
        </div>
      )}

      {activeTab === "notApproved" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Not Approved Individuals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                  <th className="py-3 px-4 border-b">Name</th>
                  <th className="py-3 px-4 border-b">National ID</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Death Certificate No.</th>
                </tr>
              </thead>
              <tbody>
                {notApprovedData.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b">{person.name}</td>
                    <td className="py-3 px-4 border-b">{person.nationalId}</td>
                    <td className="py-3 px-4 border-b">{person.email}</td>
                    <td className="py-3 px-4 border-b">{person.deathCertNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={() => downloadData(notApprovedData, "not_approved_individuals")}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
            >
              Download Not Approved Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibleNotEligiblePage;
