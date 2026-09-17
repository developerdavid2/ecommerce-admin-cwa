"use client";

import React, { useState, useEffect } from "react";
import { Store } from "@prisma/client";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Loader, TrashIcon, StoreIcon, ArrowRight } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  const router = useRouter();
  const origin = useOrigin();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("/api/stores");
        setStores(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingStores(false);
      }
    };
    fetchStores();
  }, []);

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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Stores</h3>
        {loadingStores ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <Card key={store.id} className={store.id === initialData.id ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StoreIcon className="h-5 w-5" />
                    {store.name}
                    {store.id === initialData.id && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/stores/${store.id}`}
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    {store.id === initialData.id ? "View Dashboard" : "Switch to Store"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <ApiAlert
                    title="API URL"
                    description={`${origin}/api/stores/${store.id}`}
                    variant="public"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default SettingsForm;
