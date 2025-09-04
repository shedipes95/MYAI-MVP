import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
  category: string;
  amount: number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  // Aggregate spend by category (sum of amounts)
  const aggregatedData = data.reduce(
    (acc, item) => {
      const category = item.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + Math.abs(item.amount);
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to arrays for Chart.js
  const categories = Object.keys(aggregatedData);
  const amounts = Object.values(aggregatedData);

  // Chart.js color palette
  const colors = [
    "#FF6384", // Red
    "#36A2EB", // Blue
    "#FFCE56", // Yellow
    "#4BC0C0", // Teal
    "#9966FF", // Purple
    "#FF9F40", // Orange
    "#FF6384", // Pink
    "#C9CBCF", // Grey
    "#4BC0C0", // Cyan
    "#FF6384", // Rose
  ];

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: colors.slice(0, categories.length).map((color) => color + "80"),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const category = context.label;
            const amount = context.parsed;
            return `${category}: €${amount.toLocaleString("en-EU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending by Category</h3>
        <div className="flex items-center justify-center h-64 text-slate-500">
          <p>No spending data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending by Category</h3>
      <div className="h-64 sm:h-80">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
