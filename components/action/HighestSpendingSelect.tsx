"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BASE_API_URL } from "@/index";
import HighestSpendingList from "../card/HighestSpendingList";

type HighestSpending = {
  type: string;
  _id: string;
  name: string;
  date: string;
  amount: number;
};

function HighestSpendingSelect() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [timespan, setTimespan] = useState("week");
  const [transactionData, setTransactionData] = useState<HighestSpending[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${BASE_API_URL}/api/expense/highest?span=${timespan}&userId=${userId}`,
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch expense data`);
        }

        const data = await res.json();
        setTransactionData(data);
      } catch (error: any) {
        console.error(`Error fetching expense data`, error);
      }
    };

    fetchData();
  }, [timespan, userId]);

  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value: string) => setTimespan(value)}
        defaultValue="week"
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Last 7 Days</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
      <div className="space-y-4">
        {transactionData.length ? (
          transactionData.map((data) => (
            <div key={data._id}>
              <HighestSpendingList transactionData={data} />
            </div>
          ))
        ) : (
          <div className="mt-4 flex items-center justify-center">
            No transactions yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default HighestSpendingSelect;
