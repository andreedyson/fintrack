"use client";

import { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AccountType, BASE_API_URL, CategoryType } from "@/index";
import { WalletCards } from "lucide-react";

type Props = {
  accounts: AccountType[];
  categories: CategoryType[];
};

function AddExpenseBtn({ accounts, categories }: Props) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const userId = session?.data?.user?.id;

  const [date, setDate] = useState<Date>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addExpenseSchema = z.object({
    expenseName: z
      .string()
      .min(4, { message: "Expense name should be atleast 4 characters" })
      .max(30, { message: "Expense name should be less than 30 characters" }),
    date: z.date(),
    amount: z.coerce
      .number()
      .min(1, { message: "Expense amount should be greater than 0" }),
    account: z.string(),
    category: z.string(),
  });

  const form = useForm<z.infer<typeof addExpenseSchema>>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      expenseName: "",
      date: new Date(),
      amount: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof addExpenseSchema>) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_API_URL}/api/expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.expenseName,
          date: values.date,
          amount: values.amount,
          accountId: values.account,
          categoryId: values.category,
          userId: userId,
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

      if (res.ok) {
        setSubmitting(false);
        toast({
          description: msg.message,
          variant: "success",
        });
        form.reset();
        router.refresh();
        setSheetOpen(false);
      }
    } catch (error: any) {
      setSubmitting(false);
      throw new Error(error);
    }
  };

  return (
    <div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button className="flex  w-[140px] items-center gap-2 border-2 border-foreground bg-transparent text-foreground duration-300 hover:text-background">
            <WalletCards className="h-4 w-4" /> New Expense
          </Button>
        </SheetTrigger>
        <SheetContent className="space-y-2">
          <SheetHeader className="text-left">
            <SheetTitle>Add a new expense</SheetTitle>
            <SheetDescription>
              Create a new expense inside your financial tracker.
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
                  name="expenseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger
                          asChild
                          className="dark:outline dark:outline-1"
                        >
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className=" w-auto p-0">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown-buttons"
                            selected={date}
                            onSelect={field.onChange}
                            onDayClick={setDate}
                            fromYear={2000}
                            toYear={2025}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue=""
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.length ? (
                            accounts.map((account: any) => (
                              <SelectItem
                                key={account._id}
                                value={account._id.toString()}
                                style={{ color: account.color }}
                              >
                                {account.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem
                              value="novalue"
                              disabled
                              className="flex items-center justify-center"
                            >
                              No accounts yet
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue=""
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.length ? (
                            categories.map((category: CategoryType) => (
                              <SelectItem
                                key={category._id}
                                value={category?._id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem
                              value="novalue"
                              disabled
                              className="flex items-center justify-center"
                            >
                              No categories yet
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <span className="absolute ml-2">Rp</span>
                          <Input
                            {...field}
                            min={0}
                            type="number"
                            autoComplete="off"
                            className="pl-8"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : "Add Expense"}
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

export default AddExpenseBtn;
