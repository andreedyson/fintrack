"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  Title,
  LinearScale,
  CategoryScale,
);

type Props = {
  accountData: any[];
};

function BarChart({ accountData }: Props) {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: accountData && accountData.map((acc) => acc.name),
      datasets: [
        {
          label:
            accountData &&
            accountData.length > 0 &&
            `Account ${accountData[0].type}`,
          data: accountData && accountData.map((acc) => acc.total),
          borderColor: "#50ddb3",
          backgroundColor: accountData && accountData.map((acc) => acc.color),
          borderRadius: {
            topLeft: 4,
            topRight: 4,
          },
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
          },
        },
      },
      plugins: {
        title: {
          display: true,
          position: "bottom",
          text:
            accountData &&
            accountData.length > 0 &&
            `${accountData[0].type} Overview`,
          color: "#fff",
        },
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    });
  }, [accountData]);

  const totalBalance = accountData.reduce(
    (acc, account) => acc + account.total,
    0,
  );

  return (
    <div className="h-full w-full">
      {totalBalance > 0 ? (
        <div className="h-full w-full space-y-4">
          <Bar data={chartData} options={chartOptions} className="w-full" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6">
          <Image
            src={"/assets/no-bar-data.svg"}
            width={300}
            height={600}
            alt="no-data"
          />
          <p className="max-w-56 text-center text-lg font-semibold">
            No transaction yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default BarChart;
