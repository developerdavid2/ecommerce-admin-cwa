"use client";

import React, { useState } from "react";
import { Billboard, Category } from "@prisma/client";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Loader, TrashIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Category name is required",
  }),
  billboardId: z.string().min(1, {
    message: "Select a billboard",
  }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}
const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const toastMessage = initialData ? "Category updated" : "Category created";
  const action = initialData ? "Save changes" : "Create category";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (initialData) {
        setIsUpdating(true);
        await axios.patch(
          `/api/stores/${params?.storeId}/categories/${params.categoryId}`,
          values,
        );
      } else {
        setIsCreating(true);
        await axios.post(`/api/stores/${params?.storeId}/categories`, values);
      }

      router.refresh();
      router.push(`/stores/${params.storeId}/categories`);
      toast.success(`${toastMessage}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsCreating(false);
      setIsUpdating(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(
        `/api/stores/${params?.storeId}/categories/${params.categoryId}`,
      );
      router.refresh();
      router.push("/");

      toast.success(`${toastMessage}`);
    } catch (error) {
      console.log(error);

      toast.error(
        "Make sure you removed all products for this category first.",
      );
    } finally {
      setOpen(false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isDeleting}
      />
      <div className="flex justify-between items-center">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
            disabled={isCreating || isUpdating || isDeleting}
            className="cursor-pointer"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isCreating || isUpdating || isDeleting}
                      placeholder="Enter category name.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isCreating || isUpdating || isDeleting}
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue
                          placeholder="Select a billboard"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem
                          value={billboard.id}
                          key={billboard.id}
                          className="cursor-pointer"
                        >
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isCreating || isUpdating || isDeleting}
            type="submit"
            className="relative inline-flex items-center justify-center cursor-pointer"
          >
            {isUpdating || isCreating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                <span>{isUpdating ? "Saving..." : "Creating..."}</span>
              </>
            ) : (
              <span>{action}</span>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default CategoryForm;
