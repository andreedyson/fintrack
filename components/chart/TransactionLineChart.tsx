"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import LineChart from "./LineChart";
import TimespanSelect from "../action/TimespanSelect";
import { BASE_API_URL } from "@/index";

type TransactionType = "income" | "expense";

interface TransactionLineChartProps {
  transactionType: TransactionType;
}

function TransactionLineChart({ transactionType }: TransactionLineChartProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [timespan, setTimespan] = useState("week");
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${BASE_API_URL}/api/${transactionType}/timespan?span=${timespan}&userId=${userId}`,
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch ${transactionType} data`);
        }

        const data = await res.json();
        setTransactionData(data);
      } catch (error: any) {
        console.error(`Error fetching ${transactionType} data`, error);
      }
    };

    fetchData();
  }, [timespan, userId, transactionType]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="ml-auto">
        <TimespanSelect onValueChange={(value: string) => setTimespan(value)} />
      </div>
      <LineChart accountData={transactionData} />
    </div>
  );
}

export default TransactionLineChart;
