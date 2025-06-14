"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: { url: string }[]) => void; // Expects the updated array
  onRemove: (value: string) => void;
  value: { url: string }[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    if (!result?.info?.secure_url) return;

    // Always just pass the new image
    onChange([{ url: result.info.secure_url }]);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((image) => (
          <div
            key={image.url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(image.url)}
                variant="destructive"
                size="icon"
                className="cursor-pointer"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Product image"
              src={image.url}
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="ecommerce-image-upload"
        options={{
          // For billboard-like components, set multiple to false
          multiple: true, // Allow multiple file selection
          maxFiles: 5,
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
              className="cursor-pointer"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              {value.length > 1 ? "Upload Images" : "Upload Image"}
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
