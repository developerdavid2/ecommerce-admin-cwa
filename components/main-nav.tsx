"use client";

import React, { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MainNavProps {
  className?: string;
  props?: React.HTMLAttributes<HTMLElement>;
}

const MainNav: React.FC<MainNavProps> = ({ className }) => {
  const pathname = usePathname();
  const params = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const NavLink = ({ href, label, active }: { href: string; label: string; active: boolean }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
        active
          ? "bg-primary text-primary-foreground font-bold"
          : "text-muted-foreground hover:bg-accent",
      )}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn("hidden lg:flex items-center space-x-1 lg:space-x-2", className)}>
        {routes.map((route) => (
          <NavLink key={route.href} {...route} />
        ))}
      </nav>

      {/* Mobile Navigation */}
      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-0">
          <nav className="flex flex-col p-4 space-y-1">
            {routes.map((route) => (
              <NavLink key={route.href} {...route} />
            ))}
          </nav>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MainNav;
