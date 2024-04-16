"use client";

import { ColumnDef } from "@tanstack/react-table";

import { HiArrowDownCircle } from "react-icons/hi2";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import ColumnAction from "@/components/table/ColumnAction";
import { currencyFormatter } from "@/index";

export type CategoryActivity = {
  id: string;
  name: string;
  date: Date;
  type: string;
  amount: number;
  category: string;
  account: string;
  color: string;
};

export const columns: ColumnDef<CategoryActivity>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type: string = row.getValue("type");

      return (
        <div className="flex items-center gap-2 font-semibold text-red-500">
          <HiArrowDownCircle size={16} />
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
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="category" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
      const amount = parseFloat(row.getValue("amount"));
      const formatted = currencyFormatter(amount);

      return (
        <div className="text-right font-medium text-red-500">{formatted}</div>
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
