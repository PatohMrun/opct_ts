'use client'
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ApprovalsPieChartProps {
  pendingApprovals: number;
  approvedApplicants: number;
}

const ApprovalsPieChart: React.FC<ApprovalsPieChartProps> = ({ pendingApprovals, approvedApplicants }) => {
  const data = {
    labels: ['Pending Approvals', 'Approved Applicants'],
    datasets: [
      {
        data: [pendingApprovals, approvedApplicants],
        backgroundColor: ['#FFA500', '#4CAF50'],
        hoverBackgroundColor: ['#FF8C00', '#45a049'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] font-poppins">
      <Pie data={data} options={options} />
    </div>
  );
};

export default ApprovalsPieChart;