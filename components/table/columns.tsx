"use client";

import { ColumnDef } from "@tanstack/react-table";

import { HiArrowDownCircle, HiArrowUpCircle } from "react-icons/hi2";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import ColumnAction from "./ColumnAction";
import { currencyFormatter } from "@/index";

export type TransactionActivity = {
  id: string;
  name: string;
  date: string;
  type: string;
  amount: number;
  account: any;
  color: string;
};

export const columns: ColumnDef<TransactionActivity>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type: string = row.getValue("type");

      return (
        <div
          className={`${type === "Income" ? "text-main-cyan" : "text-red-500"} flex items-center gap-2 font-semibold`}
        >
          {type === "Income" ? (
            <HiArrowUpCircle size={16} />
          ) : (
            <HiArrowDownCircle size={16} />
          )}

          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "account",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Account" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div style={{ color: rowData.color }} className="font-semibold">
          {rowData.account}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const formatDate = new Date(row.getValue("date")).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      );

      return <div>{formatDate}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Amount"
          className="flex justify-end text-right"
        />
      );
    },
    cell: ({ row }) => {
      const rowType = row.original.type;
      const amount = parseFloat(row.getValue("amount"));
      const formatted = currencyFormatter(amount);
      return (
        <div
          className={`text-right font-medium ${rowType === "Expense" && "text-red-500"} ${rowType === "Income" && "text-main-cyan"}`}
        >
          {formatted}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const activity = row.original;

      return <ColumnAction activity={activity} />;
    },
    enableHiding: false,
  },
];
