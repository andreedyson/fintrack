"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

type Props = {
  onValueChange: (value: string) => void;
};

function TimespanSelect({ onValueChange }: Props) {
  return (
    <Select onValueChange={onValueChange} defaultValue="week">
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">Last 7 Days</SelectItem>
        <SelectItem value="month">This Month</SelectItem>
        <SelectItem value="all">All Time</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default TimespanSelect;
