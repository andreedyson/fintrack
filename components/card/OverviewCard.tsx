import { currencyFormatter } from "@/index";
import React from "react";

type Props = {
  title: string;
  icon: any;
  amount: number;
  color?: string;
};

function OverviewCard({ title, icon, amount, color }: Props) {
  const formattedAmount = currencyFormatter(amount);

  return (
    <div className="flex items-center gap-4 rounded-md border px-4 py-8 shadow-md dark:bg-accent">
      <div
        className="rounded-full p-2"
        style={{
          color: `rgb(${color})`,
          backgroundColor: `rgba(${color}, 0.2)`,
        }}
      >
        {icon}
      </div>
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase text-slate-500">
          {title}
        </h4>
        <p className="text-xl font-bold">{formattedAmount}</p>
      </div>
    </div>
  );
}

export default OverviewCard;
