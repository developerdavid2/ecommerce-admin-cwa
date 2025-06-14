import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Decimal } from "@prisma/client/runtime/library";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function priceFormatter(price: Decimal | number) {
  // Convert Decimal to number if it's a Decimal object
  const numericPrice =
    typeof price === "object" && price !== null
      ? parseFloat(price.toString())
      : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);
}
