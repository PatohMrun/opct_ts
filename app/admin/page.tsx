import ApplicantsLineChart from '@/components/admin/ApplicantsLine';
import ApprovalsPieChart from '@/components/admin/approvalsPie';
import React from 'react';

const Dashboard: React.FC = () => {
  // These values would typically come from your data source
  const pendingApprovals = 150;
  const approvedApplicants = 350;

  // Sample data for the past 5 years
  const annualApplicantTrendData = [
    { year: 2019, newApplicants: 5000, removedApplicants: 500 },
    { year: 2020, newApplicants: 5500, removedApplicants: 600 },
    { year: 2021, newApplicants: 6000, removedApplicants: 550 },
    { year: 2022, newApplicants: 6500, removedApplicants: 700 },
    { year: 2023, newApplicants: 7000, removedApplicants: 800 },
  ];

  return (
    <div className="py-4 px-2 font-poppins">
      <h1 className="text-2xl font-bold mb-4 text-center">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Approval Status</h2>
          <ApprovalsPieChart 
            pendingApprovals={pendingApprovals} 
            approvedApplicants={approvedApplicants} 
          />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Annual Applicant Trends</h2>
          <ApplicantsLineChart data={annualApplicantTrendData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;