// File: components/admin/Dashboard.tsx
import ApplicantsLineChart from '@/components/admin/ApplicantsLine';
import ApprovalsPieChart from '@/components/admin/approvalsPie';
import React from 'react';

interface DashboardProps {
  pendingApprovals: number;
  approvedApplicants: number;
  annualApplicantTrendData: {
    year: number;
    newApplicants: number;
    removedApplicants: number;
  }[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  pendingApprovals, 
  approvedApplicants, 
  annualApplicantTrendData 
}) => {
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