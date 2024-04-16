"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { BASE_API_URL } from "@/index";
import { Button } from "../ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Props = {
  accountId: string;
  onSubmitSuccess: () => void;
};

function DeleteAccountDialog({ accountId, onSubmitSuccess }: Props) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const userId = session?.data?.user?.id;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_API_URL}/api/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, accountId }),
      });

      const msg = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        toast({
          description: msg.message,
          variant: "destructive",
        });
      }

      if (res.ok) {
        setSubmitting(false);
        toast({
          description: msg.message,
          variant: "success",
        });
        onSubmitSuccess();
        router.refresh();
      }
    } catch (error: any) {
      setSubmitting(false);
      throw new Error(error);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>
        <div
          className={`${buttonVariants({ variant: "outline" })} flex w-[120px] items-center bg-transparent text-red-500 outline outline-2 outline-red-500 hover:bg-red-500 hover:text-background md:w-[200px]`}
        >
          <Trash2 className="size-4" />
          Delete
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-center space-y-4 max-md:mt-6">
          <DialogTitle>
            Are you sure you want to delete this account ?
          </DialogTitle>
          <DialogDescription>
            This action will delete this account and all of its history
            permanently.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-4">
          <Button
            className="w-[120px] border-2 border-foreground bg-transparent text-foreground hover:text-background md:w-[200px]"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-[120px] bg-red-500 text-white duration-200 hover:bg-red-500/70 md:w-[200px]"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteAccountDialog;
