"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CategoryType } from "@/index";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import EditCategoryForm from "./EditCategoryForm";

type Props = {
  category: CategoryType;
};

function EditCategoryDialog({ category }: Props) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmitSuccess = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger>
          <SquarePen className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent>
          <EditCategoryForm
            category={category}
            onSubmitSuccess={handleSubmitSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditCategoryDialog;
