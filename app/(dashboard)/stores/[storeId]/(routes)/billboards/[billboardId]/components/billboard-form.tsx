"use client";

import React, { useState, useEffect } from "react";
import { Billboard } from "@prisma/client";
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
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  label: z.string().min(1, {
    message: "Billboard name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Upload a billboard image",
  }),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Create a separate state for image to handle the UI updates properly
  const [imageValue, setImageValue] = useState<{ url: string }[]>(
    initialData?.imageUrl ? [{ url: initialData.imageUrl }] : [],
  );

  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Save changes" : "Create billboard";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  // Update imageValue when form value changes
  useEffect(() => {
    const currentUrl = form.watch("imageUrl");
    if (
      currentUrl &&
      (!imageValue.length || imageValue[0].url !== currentUrl)
    ) {
      setImageValue([{ url: currentUrl }]);
    } else if (!currentUrl && imageValue.length) {
      setImageValue([]);
    }
  }, [form, imageValue]);

  // Handler for when new images are uploaded via the ImageUpload component
  const handleImageChange = (newImages: { url: string }[]) => {
    if (newImages && newImages.length > 0) {
      // Update both the form and our local state
      const newUrl = newImages[0].url;
      form.setValue("imageUrl", newUrl);
      setImageValue([{ url: newUrl }]);
    }
  };

  // Handler for when an image is removed
  const handleImageRemove = () => {
    form.setValue("imageUrl", "");
    setImageValue([]);
  };

  const onSubmit = async (values: BillboardFormValues) => {
    try {
      if (initialData) {
        setIsUpdating(true);
        await axios.patch(
          `/api/stores/${params?.storeId}/billboards/${params.billboardId}`,
          values,
        );
      } else {
        setIsCreating(true);
        await axios.post(`/api/stores/${params?.storeId}/billboards`, values);
      }

      router.refresh();
      router.push(`/stores/${params.storeId}/billboards`);
      toast.success(toastMessage);
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
        `/api/stores/${params?.storeId}/billboards/${params.billboardId}`,
      );
      router.refresh();
      router.push(`/stores/${params.storeId}/billboards`);

      toast.success("Billboard deleted.");
    } catch (error) {
      console.log(error);
      toast.error("Make sure you removed all products and categories first.");
    } finally {
      setOpen(false);
      setIsDeleting(false);
    }
  };

  // Debug logs to help identify issue
  console.log("Form imageUrl value:", form.watch("imageUrl"));
  console.log("Local imageValue state:", imageValue);

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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({}) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={imageValue} // Use our local state for the UI
                    onChange={(newImages) => {
                      // For new images added via Cloudinary
                      handleImageChange(newImages);
                    }}
                    onRemove={() => handleImageRemove()}
                    disabled={isCreating || isUpdating || isDeleting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isCreating || isUpdating || isDeleting}
                      placeholder="Enter billboard label.."
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
      <Separator />
    </>
  );
};

export default BillboardForm;
