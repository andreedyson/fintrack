"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { currencyFormatter } from "@/index";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type Props = {
  accountData: any[];
};

function DonutChart({ accountData }: Props) {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: accountData && accountData.map((acc) => acc.name),
      datasets: [
        {
          label: "Income Rp",
          data: accountData && accountData.map((acc) => acc.balance),
          backgroundColor: accountData && accountData.map((acc) => acc.color),
        },
      ],
    });

    setChartOptions({
      plugins: {
        legend: {
          display: false,
        },
      },
      borderWidth: 0,
      hoverOffset: 8,
      maintainAspectRatio: false,
      responsive: true,
      cutout: "60%",
    });
  }, [accountData]);

  const totalBalance = accountData
    .map((acc) => acc.balance)
    .reduce((prev, curr) => prev + curr, 0);

  return (
    <div>
      {accountData.length ? (
        <div className="space-y-4">
          <div className="relative">
            <div>
              <Doughnut options={chartOptions} data={chartData} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 text-center text-sm font-semibold md:text-base">
              <p>Total Balance</p>
              <p>{currencyFormatter(totalBalance)}</p>
            </div>
          </div>
          <div>
            {accountData &&
              accountData.map((account) => {
                const formattedBalance = currencyFormatter(account.balance);
                return (
                  <div key={account._id} className="mb-1 flex items-center">
                    <div
                      className="mr-2 h-3 w-10 rounded-sm"
                      style={{ backgroundColor: account.color }}
                    />
                    <div className="flex w-full items-center justify-between font-semibold">
                      <span>{account.name}</span>
                      <p>{formattedBalance}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="flex h-[450px] flex-col items-center justify-center gap-6">
          <Image
            src={"/assets/no-data.svg"}
            width={300}
            height={600}
            alt="no-data"
          />
          <p className="max-w-56 text-center text-lg font-semibold">
            You haven&apos;t add any account data yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default DonutChart;
