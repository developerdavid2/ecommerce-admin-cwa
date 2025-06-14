"use client";

import React from "react";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MainNavProps {
  className?: string;
  props?: React.HTMLAttributes<HTMLElement>;
}

const MainNav: React.FC<MainNavProps> = ({ className }) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/stores/${params.storeId}`,
      label: "Overview",
      active: pathname === `/stores/${params.storeId}`,
    },
    {
      href: `/stores/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/stores/${params.storeId}/billboards`,
    },
    {
      href: `/stores/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/stores/${params.storeId}/categories`,
    },
    {
      href: `/stores/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/stores/${params.storeId}/sizes`,
    },
    {
      href: `/stores/${params.storeId}/colours`,
      label: "Colours",
      active: pathname === `/stores/${params.storeId}/colours`,
    },
    {
      href: `/stores/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/stores/${params.storeId}/products`,
    },
    {
      href: `/stores/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/stores/${params.storeId}/orders`,
    },
    {
      href: `/stores/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/stores/${params.storeId}/settings`,
    },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white font-bold"
              : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
export default MainNav;
