'use client'
import React, { useState } from 'react';
import { FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface Dependent {
  dependentFirstName: string;
  dependentMiddleName: string;
  dependentLastName: string;
  dependentGender: string;
  dependentDob: string;
  dependentRelationship: string;
}

interface ApplicationData {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  nationalId: string;
  kra: string;
  marital: string;
  email: string;
  phone: string;
  address: string;
  county: string;
  subCounty: string;
  constituency: string;
  ward: string;
  location: string;
  subLocation: string;
  village: string;
  income: string;
  employment: string;
  assistance: string;
  illness: string;
  disabled: string;
  kinFirstName: string;
  kinMiddleName: string;
  kinLastName: string;
  kinRelationship: string;
  kinEmail: string;
  kinPhone: string;
  bankName: string;
  bankAccount: string;
  payeeFirstName: string;
  payeeMiddleName: string;
  payeeLastName: string;
  payeeBankName: string;
  payeeBankAccount: string;
  dependents: Dependent[];
  status: 'pending' | 'approved' | 'rejected';
  isDeceased: boolean;
}

interface ApplicationsProps {
  applicationData: ApplicationData[];
}

const Applications: React.FC<ApplicationsProps> = ({ applicationData }) => {
  const [applications, setApplications] = useState<ApplicationData[]>(applicationData);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (application: ApplicationData) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStatusChange = async (id: number, newStatus: 'approved' | 'rejected') => {
    try {
      console.log(`Updating application ${id} to status ${newStatus}`); // Debugging log
      const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      const updatedApplication = await response.json();
      console.log('Updated application:', updatedApplication); // Debugging log

      setApplications(prevData =>
        prevData.map(app =>
          app.id === id ? { ...app, status: updatedApplication.status.toLowerCase() as ApplicationData['status'] } : app
        )
      );
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication({ ...selectedApplication, status: updatedApplication.status.toLowerCase() as ApplicationData['status'] });
      }
      closeModal();
    } catch (error) {
      console.error('Error updating application status:', error);
      // You might want to show an error message to the user here
    }
  };

  const StatusButton: React.FC<{ status: 'approved' | 'rejected', onClick: () => void, disabled: boolean }> = ({ status, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-1 px-2 rounded-full text-white text-xs font-bold ${
        status === 'approved'
          ? disabled ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'
          : disabled ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'
      } transition-colors duration-200 flex items-center`}
    >
      {status === 'approved' ? <FiCheckCircle className="mr-1" /> : <FiXCircle className="mr-1" />}
      {status === 'approved' ? 'Approve' : 'Reject'}
    </button>
  );

  return (
    <section className='py-2 min-h-screen font-poppins mx-auto w-[80vw] sm:w-[85vw] lg:w-[92vw]'>
      <h1 className="text-2xl font-bold mb-4 text-center">Applications</h1>
      <div className="mx-auto overflow-x-auto shadow-md sm:rounded-lg ">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-6">Name</th>
              <th scope="col" className="py-3 px-6">National ID</th>
              <th scope="col" className="py-3 px-6">Email</th>
              <th scope="col" className="py-3 px-6">Phone</th>
              <th scope="col" className="py-3 px-6">Status</th>
              <th scope="col" className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className={`bg-white border-b hover:bg-gray-50 ${application.isDeceased ? 'bg-gray-200' : ''}`}>
                <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {`${application.firstName} ${application.middleName} ${application.lastName}`}
                  {application.isDeceased && <span className="ml-2 text-red-500">(Deceased)</span>}
                </td>
                <td className="py-4 px-6">{application.nationalId}</td>
                <td className="py-4 px-6">{application.email}</td>
                <td className="py-4 px-6">{application.phone}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    application.status === 'approved' ? 'bg-green-100 text-green-800' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => openModal(application)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded inline-flex items-center"
                    >
                      <FiEye className="mr-1" />
                      View
                    </button>
                    <StatusButton
                      status="approved"
                      onClick={() => handleStatusChange(application.id, 'approved')}
                      disabled={application.status === 'approved' || application.isDeceased}
                    />
                    <StatusButton
                      status="rejected"
                      onClick={() => handleStatusChange(application.id, 'rejected')}
                      disabled={application.status === 'rejected' || application.isDeceased}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white overflow-y-auto max-h-[80vh]"
               onClick={e => e.stopPropagation()}>
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                Application Details: {selectedApplication.firstName} {selectedApplication.lastName}
              </h3>
              <div className="mt-2 px-7 py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <h4 className="font-bold mb-2">Personal Information</h4>
                    <p>Full Name: {`${selectedApplication.firstName} ${selectedApplication.middleName} ${selectedApplication.lastName}`}</p>
                    <p>Gender: {selectedApplication.gender}</p>
                    <p>Date of Birth: {selectedApplication.dob}</p>
                    <p>National ID: {selectedApplication.nationalId}</p>
                    <p>KRA PIN: {selectedApplication.kra}</p>
                    <p>Marital Status: {selectedApplication.marital}</p>
                    <p>Email: {selectedApplication.email}</p>
                    <p>Phone: {selectedApplication.phone}</p>
                    <p>Employment Status: {selectedApplication.employment}</p>
                    <p>Source of Income: {selectedApplication.income}</p>
                    <p>Other Assistance: {selectedApplication.assistance}</p>
                    <p>Chronic Illness: {selectedApplication.illness}</p>
                    <p>Disabled: {selectedApplication.disabled}</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Address Information</h4>
                    <p>Address: {selectedApplication.address}</p>
                    <p>County: {selectedApplication.county}</p>
                    <p>Sub-County: {selectedApplication.subCounty}</p>
                    <p>Constituency: {selectedApplication.constituency}</p>
                    <p>Ward: {selectedApplication.ward}</p>
                    <p>Location: {selectedApplication.location}</p>
                    <p>Sub-Location: {selectedApplication.subLocation}</p>
                    <p>Village: {selectedApplication.village}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Next of Kin</h4>
                  <p>Name: {`${selectedApplication.kinFirstName} ${selectedApplication.kinMiddleName} ${selectedApplication.kinLastName}`}</p>
                  <p>Relationship: {selectedApplication.kinRelationship}</p>
                  <p>Email: {selectedApplication.kinEmail}</p>
                  <p>Phone: {selectedApplication.kinPhone}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Bank Details</h4>
                  <p>Bank Name: {selectedApplication.bankName}</p>
                  <p>Account Number: {selectedApplication.bankAccount}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Alternate Payee (if applicable)</h4>
                  <p>Name: {`${selectedApplication.payeeFirstName} ${selectedApplication.payeeMiddleName} ${selectedApplication.payeeLastName}`}</p>
                  <p>Bank Name: {selectedApplication.payeeBankName}</p>
                  <p>Account Number: {selectedApplication.payeeBankAccount}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Dependents</h4>
                  {selectedApplication.dependents.map((dependent, index) => (
                    <div key={index} className="mb-2">
                      <p>Name: {`${dependent.dependentFirstName} ${dependent.dependentMiddleName} ${dependent.dependentLastName}`}</p>
                      <p>Gender: {dependent.dependentGender}</p>
                      <p>Date of Birth: {dependent.dependentDob}</p>
                      <p>Relationship: {dependent.dependentRelationship}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="items-center px-4 py-3 flex justify-end space-x-2">
              <StatusButton
                status="approved"
                onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                disabled={selectedApplication.status === 'approved' || selectedApplication.isDeceased}
              />
              <StatusButton
                status="rejected"
                onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                disabled={selectedApplication.status === 'rejected' || selectedApplication.isDeceased}
              />
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Applications;