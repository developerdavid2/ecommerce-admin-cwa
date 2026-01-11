"use client";

import React, { useState } from "react";
import { Size } from "@prisma/client";
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

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Size name is required",
  }),
  value: z.string().min(1, {
    message: "Enter a value",
  }),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null;
}
const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const toastMessage = initialData ? "Size updated." : "Size created.";
  const action = initialData ? "Save changes" : "Create size";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (values: SizeFormValues) => {
    try {
      if (initialData) {
        setIsUpdating(true);
        await axios.patch(
          `/api/stores/${params?.storeId}/sizes/${params.sizeId}`,
          values
        );
      } else {
        setIsCreating(true);
        await axios.post(`/api/stores/${params?.storeId}/sizes`, values);
      }

      router.refresh();
      router.push(`/stores/${params.storeId}/sizes`);
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
        `/api/stores/${params?.storeId}/sizes/${params.sizeId}`
      );
      router.refresh();
      router.push(`/stores/${params.storeId}/sizes`);

      toast.success(`${toastMessage}`);
    } catch (error) {
      console.log(error);

      toast.error("Make sure you removed all products for this size first.");
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
                  <FormLabel>Size label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isCreating || isUpdating || isDeleting}
                      placeholder="Enter size name.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isCreating || isUpdating || isDeleting}
                      placeholder="Enter size value.."
                      {...field}
                    />
                  </FormControl>
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
export default SizeForm;
