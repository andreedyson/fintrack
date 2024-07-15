"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Image from "next/image";
import { currencyFormatter } from "@/index";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  accountData: any[];
};

function TransactionPieChart({ accountData }: Props) {
  const [chartData, setChartData] = useState<any>({ datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: accountData && accountData.map((acc) => acc.name),
      datasets: [
        {
          label: "Income Account",
          data: accountData && accountData.map((acc) => acc.total),
          backgroundColor: accountData && accountData.map((acc) => acc.color),
          rotation: 45,
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
      maintainAspectRatio: false,
      responsive: true,
      cutout: "60%",
    });
  }, [accountData]);

  const totalBalance = accountData
    .map((acc) => acc.total)
    .reduce((prev, curr) => prev + curr, 0);

  return (
    <div className="h-full w-full">
      {totalBalance > 0 ? (
        <div className="h-full w-full">
          <div className="relative">
            <div className="z-50 flex h-[350px] w-full items-center justify-center">
              <Pie options={chartOptions} data={chartData} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 text-center text-sm font-semibold md:text-base">
              <p>{accountData.length > 0 && accountData[0].type}</p>
              <p>{accountData.length > 0 && currencyFormatter(totalBalance)}</p>
            </div>
          </div>
          <div>
            {accountData &&
              accountData.map((account) => {
                const formattedTotal = currencyFormatter(account.total);
                return (
                  <div key={account.name}>
                    {account.total > 0 && (
                      <div className="mb-1 flex items-center">
                        <div
                          className="mr-2 h-3 w-10 rounded-sm"
                          style={{ backgroundColor: account.color }}
                        />
                        <div className="flex w-full items-center justify-between font-semibold">
                          <span>{account.name}</span>
                          <p>{formattedTotal}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-6 md:h-[430px]">
          <Image
            src={"/assets/no-pie-data.svg"}
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

export default TransactionPieChart;
