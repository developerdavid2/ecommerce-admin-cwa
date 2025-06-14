"use client";

import React, { useState } from "react";
import { Colour } from "@prisma/client";
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
    message: "Colour name is required",
  }),
  value: z.string().min(4).regex(/^#/, {
    message: "Enter a valid hex code",
  }),
});

type ColourFormValues = z.infer<typeof formSchema>;

interface ColourFormProps {
  initialData: Colour | null;
}
const ColourForm: React.FC<ColourFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit colour" : "Create colour";
  const description = initialData ? "Edit a colour" : "Add a new colour";
  const toastMessage = initialData ? "Colour updated." : "Colour created.";
  const action = initialData ? "Save changes" : "Create colour";

  const form = useForm<ColourFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (values: ColourFormValues) => {
    try {
      if (initialData) {
        setIsUpdating(true);
        await axios.patch(
          `/api/stores/${params?.storeId}/colours/${params.colourId}`,
          values,
        );
      } else {
        setIsCreating(true);
        await axios.post(`/api/stores/${params?.storeId}/colours`, values);
      }

      router.refresh();
      router.push(`/stores/${params.storeId}/colours`);
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
        `/api/stores/${params?.storeId}/colours/${params.colourId}`,
      );
      router.refresh();
      router.push(`/stores/${params.storeId}/colours`);

      toast.success("Colour deleted.");
    } catch (error) {
      console.log(error);

      toast.error("Make sure you removed all products for this colour first.");
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
                  <FormLabel>Colour label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isCreating || isUpdating || isDeleting}
                      placeholder="Enter colour name.."
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
                  <FormLabel>Colour Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isCreating || isUpdating || isDeleting}
                        placeholder="Enter colour value.."
                        {...field}
                      />
                      <div
                        className="p-4 rounded-full border"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
export default ColourForm;
