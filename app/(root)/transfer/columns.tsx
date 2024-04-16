"use client";

import { ColumnDef } from "@tanstack/react-table";

import { HiMiniArrowsRightLeft } from "react-icons/hi2";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import ColumnAction from "@/components/table/ColumnAction";
import { currencyFormatter } from "@/index";

export type TransferActivity = {
  id: string;
  name: string;
  date: Date;
  type: string;
  amount: number;
  from: any;
  to: any;
  fromColor: string;
  toColor: string;
  color: string;
};

export const columns: ColumnDef<TransferActivity>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type: string = row.getValue("type");

      return (
        <div className="flex items-center gap-2 font-semibold text-yellow-500">
          <HiMiniArrowsRightLeft size={16} />
          {type}
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
    accessorKey: "from",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="From" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div style={{ color: rowData.fromColor }} className="font-semibold">
          {rowData.from}
        </div>
      );
    },
  },
  {
    accessorKey: "to",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="To" />;
    },
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div style={{ color: rowData.toColor }} className="font-semibold">
          {rowData.to}
        </div>
      );
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

      return <div className="text-right font-medium">{formatted}</div>;
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
