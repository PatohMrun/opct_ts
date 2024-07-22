'use client'
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface YearlyData {
  year: number;
  newApplicants: number;
  removedApplicants: number;
}

interface ApplicantsLineChartProps {
  data: YearlyData[];
}

const ApplicantsLineChart: React.FC<ApplicantsLineChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.year.toString()),
    datasets: [
      {
        label: 'New Applicants',
        data: data.map(d => d.newApplicants),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Removed Applicants',
        data: data.map(d => d.removedApplicants),
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Annual Applicant Trends',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString(); // Add thousands separators
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Applicants',
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString(); // Add thousands separators
          }
        }
      },
    },
  };

  return (
    <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] font-poppins">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ApplicantsLineChart;