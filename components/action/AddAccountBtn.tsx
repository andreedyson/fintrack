"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { BASE_API_URL } from "@/index";
import { Landmark } from "lucide-react";

function AddAccountBtn() {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const userId = session?.data?.user?.id;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      accountName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof addAcountSchema>) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_API_URL}/api/account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.accountName,
          balance: 0,
          userId: userId,
          color: values.color,
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
      setSheetOpen(false);
      router.refresh();
    } catch (error: any) {
      setSubmitting(false);
      throw new Error(error);
    }
  };

  return (
    <div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button className="flex w-[140px] items-center gap-2 border-2 border-foreground bg-transparent text-foreground duration-300 hover:text-background">
            <Landmark className="h-4 w-4" />
            New Account
          </Button>
        </SheetTrigger>
        <SheetContent className="space-y-2">
          <SheetHeader className="text-left">
            <SheetTitle>Add a new account</SheetTitle>
            <SheetDescription>
              Create a new finance account to track your financial transactions.
            </SheetDescription>
          </SheetHeader>
          <div>
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
                <SheetFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : "Add Account"}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AddAccountBtn;
