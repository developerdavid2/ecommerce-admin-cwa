"use client";

import React, { useState, useCallback } from "react"; // Import useCallback
import * as z from "zod";
import { Category, Colour, Image, Product, Size } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AlertModal from "@/components/modals/alert-modal";
import Heading from "@/components/ui/heading";

interface ProductFromProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  colours: Colour[];
  sizes: Size[];
}

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colourId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC<ProductFromProps> = ({
  initialData,
  categories,
  colours,
  sizes,
}) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const params = useParams();

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create product";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          images: initialData.images || [],
          isFeatured: initialData.isFeatured,
          isArchived: initialData.isArchived,
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          sizeId: "",
          colourId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  console.log("Form images array:", form.getValues("images"));

  const handleImageUpload = useCallback(
    (newUrls: { url: string }[]) => {
      form.setValue("images", [...form.getValues("images"), ...newUrls]);
    },
    [form],
  );

  const handleImageRemove = useCallback(
    (urlToRemove: string) => {
      form.setValue(
        "images",
        form.getValues("images").filter((image) => image.url !== urlToRemove),
      );
    },
    [form],
  );

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (initialData) {
        setIsUpdating(true);
        await axios.patch(
          `/api/stores/${params?.storeId}/products/${params.productId}`,
          values,
        );
      } else {
        setIsCreating(true);
        await axios.post(`/api/stores/${params?.storeId}/products`, values);
      }

      router.refresh();
      router.push(`/stores/${params.storeId}/products`);
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
        `/api/stores/${params?.storeId}/products/${params.productId}`,
      );
      router.refresh();
      router.push(`/stores/${params.storeId}/products`);

      toast.success("Product deleted.");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
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
        loading={isCreating || isUpdating || isDeleting}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={isCreating || isUpdating || isDeleting}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              console.log("Current field value in render:", field.value);

              return (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={isCreating || isUpdating || isDeleting}
                      onChange={handleImageUpload} // Use the direct handler
                      onRemove={handleImageRemove} // Use the direct handler
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isCreating || isUpdating || isDeleting}
                      placeholder="Product Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isCreating || isUpdating || isDeleting}
                      placeholder="Product Price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isCreating || isUpdating || isDeleting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={isCreating || isUpdating || isDeleting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a size"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colourId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-x-2">
                    <FormLabel>Colour</FormLabel>

                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{
                        backgroundColor: colours.find(
                          (c) => c.id === field.value,
                        )?.value,
                      }}
                    />
                  </div>
                  <Select
                    disabled={isCreating || isUpdating || isDeleting}
                    value={field.value}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue
                          placeholder="Select a colour"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colours.map((colour) => (
                        <SelectItem
                          value={colour.id}
                          key={colour.id}
                          className="cursor-pointer"
                        >
                          {colour.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      The product will appear on the home page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      The product will appear anywhere in the store.
                    </FormDescription>
                  </div>
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
      {/* <Separator /> */}
    </>
  );
};

export default ProductForm;
