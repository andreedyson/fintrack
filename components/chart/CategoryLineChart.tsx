"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Image from "next/image";
import { CategoryType } from "@/index";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Filler,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type Props = {
  categoryData: any;
};

function CategoryLineChart({ categoryData }: Props) {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  const dateLabels = categoryData.expenses.map((exp: any) => exp.expenseDate);
  const categoryLabel = categoryData.categoryName;
  const expensesAmount = categoryData.expenses.map(
    (exp: any) => exp.expenseAmount,
  );

  const maxAmount = Math.max(...expensesAmount);
  const maxY = Math.ceil(maxAmount / 500) * 500;

  useEffect(() => {
    if (!categoryData) return;

    setChartData({
      labels: dateLabels,
      datasets: [
        {
          label: categoryLabel,
          data: expensesAmount,
          fill: true,
          borderColor: "#ffae42",
          backgroundColor: "rgba(255, 174, 66, 0.4)",
          pointBackgroundColor: "rgba(255, 255, 255, 0.8)",
          radius: 4,
          hoverRadius: 6,
          tension: 0.4,
        },
      ],
    });

    setChartOptions({
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: "#999",
          },
        },
        y: {
          ticks: {
            color: "#999",
            stepSize: maxY / 5,
            suggestedRotation: 90,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          position: "top",
          text: `${categoryLabel} Expense Overview`,
          color: "#999",
        },
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryData]);

  return (
    <div className="h-full w-full space-y-4">
      {categoryData ? (
        <Line
          data={chartData}
          options={chartOptions}
          className=" h-full w-full"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6">
          <Image
            src={"/assets/no-data-linechart.svg"}
            width={300}
            height={600}
            alt="No Data Linechart"
          />
          <p className="max-w-56 text-center text-lg font-semibold">
            No transaction yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default CategoryLineChart;
