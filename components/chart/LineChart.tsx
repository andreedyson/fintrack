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
  accountData: any[];
};

function LineChart({ accountData }: Props) {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (!accountData) return;

    const groupedData = accountData.reduce((acc, curr) => {
      const date = new Date(curr.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      acc[date] = (acc[date] || 0) + curr.amount;
      return acc;
    }, {});

    const dataArray = Object.keys(groupedData).map((date) => ({
      date,
      amount: groupedData[date],
    }));

    dataArray.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    const labels = dataArray.map((item) => item.date);
    const data = dataArray.map((item) => item.amount);

    const maxAmount = Math.max(...(data as number[]));
    const maxY = Math.ceil(maxAmount / 500) * 500;

    const type = new Set(accountData.map((acc) => acc.type))
      .values()
      .next().value;

    setChartData({
      labels: labels,
      datasets: [
        {
          label: type,
          data: data,
          fill: true,
          borderColor: "#50ddb3",
          backgroundColor: "rgba(80, 221, 179, 0.4)",
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
          text: "Overview",
          color: "#999",
        },
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    });
  }, [accountData]);

  return (
    <div className="h-full w-full space-y-4">
      {accountData.length ? (
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

export default LineChart;
