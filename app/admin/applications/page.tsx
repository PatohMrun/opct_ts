"use client";

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
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  dependents: Dependent[];
}

const initialApplicationData: ApplicationData[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    nationalId: '12345678',
    email: 'john@example.com',
    phone: '1234567890',
    status: 'pending',
    dependents: [
      { dependentFirstName: 'Jane', dependentLastName: 'Doe', dependentRelationship: 'Daughter', dependentDob: '2010-05-15', dependentGender: 'Female', dependentMiddleName: '' },
    ],
  },
  // ... more application data
];

const Applications: React.FC = () => {
  const [applicationData, setApplicationData] = useState<ApplicationData[]>(initialApplicationData);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (application: ApplicationData) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    setApplicationData(prevData =>
      prevData.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({ ...selectedApplication, status: newStatus });
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
              {applicationData.map((application) => (
                <tr key={application.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                    {`${application.firstName} ${application.lastName}`}
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
                        disabled={application.status === 'approved'}
                      />
                      <StatusButton
                        status="rejected"
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                        disabled={application.status === 'rejected'}
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
               onClick={e => e.stopPropagation()}>
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                Application Details: {selectedApplication.firstName} {selectedApplication.lastName}
              </h3>
              <div className="mt-2 px-7 py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <h4 className="font-bold mb-2">Personal Information</h4>
                    <p>First Name: {selectedApplication.firstName}</p>
                    <p>Last Name: {selectedApplication.lastName}</p>
                    <p>National ID: {selectedApplication.nationalId}</p>
                    <p>Email: {selectedApplication.email}</p>
                    <p>Phone: {selectedApplication.phone}</p>
                    <p>Status: {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Dependents</h4>
                    {selectedApplication.dependents.map((dependent, index) => (
                      <div key={index} className="mb-2">
                        <p>Name: {`${dependent.dependentFirstName} ${dependent.dependentLastName}`}</p>
                        <p>Relationship: {dependent.dependentRelationship}</p>
                        <p>Date of Birth: {dependent.dependentDob}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="items-center px-4 py-3 flex justify-end space-x-2">
              <StatusButton
                status="approved"
                onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                disabled={selectedApplication.status === 'approved'}
              />
              <StatusButton
                status="rejected"
                onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                disabled={selectedApplication.status === 'rejected'}
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