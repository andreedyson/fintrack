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
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/index";
import { Layers } from "lucide-react";

function AddCategoryBtn() {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const userId = session?.data?.user?.id;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addCategorySchema = z.object({
    categoryName: z
      .string()
      .min(4, { message: "Category name should be atleast 4 characters" })
      .max(30, { message: "Category name should be less than 30 characters" }),
    budget: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof addCategorySchema>>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      categoryName: "",
      budget: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof addCategorySchema>) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_API_URL}/api/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.categoryName,
          budget: values.budget || 0,
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

      setSubmitting(false);
      toast({
        description: msg.message,
        variant: "success",
      });
      form.reset();
      router.refresh();
      setSheetOpen(false);
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
            <Layers className="h-4 w-4" />
            New category
          </Button>
        </SheetTrigger>
        <SheetContent className="space-y-2">
          <SheetHeader className="text-left">
            <SheetTitle>Add a new category</SheetTitle>
            <SheetDescription>
              Create a new financial category to track your financial
              transactions.
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
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage className="dark:text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Budget{" "}
                        <span className="text-muted-foreground">
                          (can be 0)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <span className="absolute ml-2">Rp</span>
                          <Input
                            type="number"
                            {...field}
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
                    {submitting ? "Adding..." : "Add Category"}
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

export default AddCategoryBtn;
