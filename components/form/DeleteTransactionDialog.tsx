"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BASE_API_URL } from "@/index";
import { Button } from "../ui/button";

type Props = {
  activity: any;
  onSubmitSuccess: () => void;
};

function DeleteTransactionDialog({ activity, onSubmitSuccess }: Props) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const userId = session?.data?.user?.id;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `${BASE_API_URL}/api/${activity.type.toLowerCase()}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            [activity.type === "Income"
              ? "incomeId"
              : activity.type === "Transfer"
                ? "transferId"
                : "expenseId"]: activity._id,
          }),
        },
      );

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
        router.refresh();
        setSubmitting(false);
        onSubmitSuccess();
      }
    } catch (error: any) {
      setSubmitting(false);
      throw new Error(error);
    }
  };
  return (
    <div className="mt-4 flex flex-col items-center space-y-4">
      <DialogHeader className="flex items-center">
        <DialogTitle className="max-md:text-base">
          Are you sure you want to delete this {activity.type} Transaction?
        </DialogTitle>
        <DialogDescription className="max-md:text-xs">
          This will delete this {activity.type} transactions permanently.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center gap-6">
        <Button
          className="w-[120px] border-2 border-foreground bg-transparent text-foreground hover:text-background md:w-[200px]"
          onClick={() => onSubmitSuccess()}
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
    </div>
  );
}

export default DeleteTransactionDialog;
