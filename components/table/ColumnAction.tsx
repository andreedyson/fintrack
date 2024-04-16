"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { TransactionActivity } from "./columns";
import { TransferActivity } from "@/app/(root)/transfer/columns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import EditTransactionDialog from "../form/EditTransactionDialog";
import DeleteTransactionDialog from "../form/DeleteTransactionDialog";
import { CategoryActivity } from "@/app/(root)/category/category-columns";

type Props = {
  activity: TransactionActivity | TransferActivity | CategoryActivity;
};

function ColumnAction({ activity }: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState("");

  const handleSubmitSuccess = () => {
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(activity.amount.toString());
            }}
          >
            Copy Transaction Amount
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => setAction("edit")}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" /> Edit {activity.type}
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={() => setAction("delete")}>
            <DropdownMenuItem className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" color="red" />
              Delete {activity.type}
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        {action === "delete" ? (
          <DeleteTransactionDialog
            activity={activity}
            onSubmitSuccess={handleSubmitSuccess}
          />
        ) : (
          <EditTransactionDialog
            activity={activity}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ColumnAction;
