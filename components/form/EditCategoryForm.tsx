"use client";

import { useState } from "react";
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
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

type Props = {
  category: any;
  onSubmitSuccess: () => void;
};

function EditCategoryForm({ category, onSubmitSuccess }: Props) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const userId = session?.data?.user?.id;

  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const editCategorySchema = z.object({
    categoryName: z
      .string()
      .min(4, { message: "Category name should be atleast 4 characters" })
      .max(30, { message: "Category name should be less than 30 characters" }),
    budget: z.coerce.number(),
  });

  const form = useForm<z.infer<typeof editCategorySchema>>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      categoryName: category.name,
      budget: category.budget,
    },
  });

  const onSubmit = async (values: z.infer<typeof editCategorySchema>) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_API_URL}/api/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          newName: values.categoryName,
          newBudget: values.budget || 0,
          categoryId: category._id,
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
        <DialogTitle>Edit category details</DialogTitle>
        <DialogDescription>Edit your category details</DialogDescription>
      </DialogHeader>
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
                  <span className="text-muted-foreground">(can be 0)</span>
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
          <div className="flex items-center justify-between">
            <div onClick={() => setDeleteDialogOpen(true)}>
              <DeleteCategoryDialog
                categoryId={category._id}
                onSubmitSuccess={onSubmitSuccess}
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-[120px] md:w-[200px]"
            >
              {submitting ? "Editing..." : "Edit Category"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditCategoryForm;
