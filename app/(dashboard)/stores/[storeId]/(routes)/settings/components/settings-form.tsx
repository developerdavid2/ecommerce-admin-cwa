"use client";

import React, { useState } from "react";
import { Store } from "@prisma/client";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Loader, TrashIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Store name is required",
  }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setIsUpdating(true);

      await axios.patch(`/api/stores/${initialData.id}`, values);
      router.refresh();

      toast.success("Store updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/stores/${initialData.id}`);
      router.refresh();
      router.push("/");

      toast.success("Store deleted successfully");
    } catch (error) {
      console.log(error);

      toast.error("Make sure you removed all products and categories first.");
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
        <Heading title="Settings" description="Manage your preferences" />
        <Button
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
          disabled={isUpdating || isDeleting}
          className="cursor-pointer"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
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
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdating || isDeleting}
                      placeholder="Enter store name.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isUpdating || isDeleting}
            type="submit"
            className="relative inline-flex items-center justify-center cursor-pointer"
          >
            {isUpdating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/stores/${initialData.id}`}
        variant="public"
      />
    </>
  );
};
export default SettingsForm;
