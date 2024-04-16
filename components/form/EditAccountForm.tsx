"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { AccountType, BASE_API_URL } from "@/index";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import DeleteAccountDialog from "./DeleteAccountDialog";

type Props = {
  account: AccountType;
  onSubmitSuccess: () => void;
};

function EditAccountForm({ account, onSubmitSuccess }: Props) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const userId = session?.data?.user?.id;

  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const addAcountSchema = z.object({
    accountName: z
      .string()
      .min(3, { message: "Account name should be atleast 3 characters" })
      .max(30, { message: "Account name should be less than 30 characters" }),
    color: z.string().nonempty(),
  });

  const form = useForm<z.infer<typeof addAcountSchema>>({
    resolver: zodResolver(addAcountSchema),
    defaultValues: {
      accountName: account.name,
      color: account.color,
    },
  });

  const onSubmit = async (values: z.infer<typeof addAcountSchema>) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_API_URL}/api/account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          accountId: account._id,
          newName: values.accountName,
          newColor: values.color,
        }),
      });

      const msg = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        toast({
          description: msg.message,
          variant: "destructive",
        });
      }

      setSubmitting(false);
      toast({
        description: msg.message,
        variant: "success",
      });
      form.reset();
      onSubmitSuccess();
      router.refresh();
    } catch (error: any) {
      setSubmitting(false);
      throw new Error(error);
    }
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Edit account details</DialogTitle>
        <DialogDescription>Edit your account details</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="accountName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="off" />
                </FormControl>
                <FormMessage className="dark:text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input {...field} type="color" autoComplete="off" />
                </FormControl>
                <FormMessage className="dark:text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <div onClick={() => setDeleteDialogOpen(true)}>
              <DeleteAccountDialog
                accountId={account._id}
                onSubmitSuccess={onSubmitSuccess}
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-[120px] md:w-[200px]"
            >
              {submitting ? "Editing..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditAccountForm;
