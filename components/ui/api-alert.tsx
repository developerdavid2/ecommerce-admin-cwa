"use client";

import React, { useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<
  ApiAlertProps["variant"],
  VariantProps<typeof badgeVariants>["variant"]
> = {
  public: "secondary",
  admin: "destructive",
};

const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public",
}) => {
  const onCopy = useCallback(() => {
    try {
      // Create temporary input element
      const tempInput = document.createElement("textarea");
      tempInput.value = description;

      // Add to DOM but make it invisible
      tempInput.style.position = "absolute";
      tempInput.style.left = "-9999px";
      document.body.appendChild(tempInput);

      // Select the text and copy it
      tempInput.select();
      document.execCommand("copy");

      // Remove the element
      document.body.removeChild(tempInput);

      toast.success("API Route copied to clipboard");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy API Route");
    }
  }, [description]);

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-semibold">
          {description}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
          className="cursor-pointer"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlert;
