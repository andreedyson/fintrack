"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { AccountType } from "@/index";
import { SquarePen } from "lucide-react";
import EditAccountForm from "./EditAccountForm";

type Props = {
  account: AccountType;
};

function EditAccountDialog({ account }: Props) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmitSuccess = () => {
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>
        <SquarePen className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <EditAccountForm
          account={account}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditAccountDialog;
