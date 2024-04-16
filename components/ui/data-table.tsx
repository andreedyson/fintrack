"use client";

import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "./button";
import { Input } from "@/components/ui/input";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DataTableViewOptions } from "../table/DataTableViewOptions";
import { DataTableFilter } from "../table/DataTableFilter";
import Image from "next/image";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

type DataWithType<T> = T & {
  accountId?: string;
  account?: string;
  from?: string;
  to?: string;
  category?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<DataWithType<TData>, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const uniqueAccounts = new Set(data.map((item) => item.account ?? item.to));
  const uniqueCategory = new Set(data.map((item) => item.category));

  const accountFilterOptions = Array.from(uniqueAccounts).map((account) => ({
    value: account,
    label: account,
  }));

  const categoryFilterOptions = Array.from(uniqueCategory).map((category) => ({
    value: category,
    label: category,
  }));

  return (
    <div>
      <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center">
        <Input
          placeholder="Filter transaction..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="dark:outline dark:outline-1 md:w-[150px] lg:w-[250px]"
        />
        <div className="flex h-8 flex-col items-center gap-2 md:ml-auto xl:flex-row">
          <div className="ml-auto flex h-8 items-center gap-2">
            {table.getColumn("account") && (
              <DataTableFilter
                column={table.getColumn("account")}
                title="Account"
                options={accountFilterOptions}
              />
            )}
            {table.getColumn("category") && (
              <DataTableFilter
                column={table.getColumn("category")}
                title="Category"
                options={categoryFilterOptions}
              />
            )}
          </div>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-4 py-4">
                    <Image
                      src={"/assets/no-result.svg"}
                      width={300}
                      height={600}
                      alt="no-result"
                      className="hidden sm:block"
                    />
                    <p>No results.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) available.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
