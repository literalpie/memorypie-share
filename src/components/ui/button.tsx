import { cn } from "#src/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        link: "text-primary-text underline-offset-4 hover:underline",
        primary: [
          "px-2 py-1.5 text-base font-bold border-0 cursor-pointer select-none transition-all duration-200 ease-in-out",
          "text-primary-text bg-inherit",
          "shadow-[var(--color-primary-shadow)_1px_1px_0_2px]",
          "hover:shadow-[var(--color-primary-shadow)_1px_1px_0_3px]",
          "active:shadow-[var(--color-primary-shadow)_-1px_-1px_0_3px]",
          "focus:shadow-[var(--color-primary-shadow-focused)_1px_1px_0_3px] focus:outline-0",
        ],
        destructive: [
          "px-2 py-1.5 text-base font-bold border-0 cursor-pointer transition-all duration-200 ease-in-out",
          "text-[var(--color-destructive-text)] bg-inherit",
          "shadow-[var(--color-destructive-shadow)_1px_1px_0_2px]",
          "hover:shadow-[var(--color-destructive-shadow)_1px_1px_0_3px]",
          "active:shadow-[var(--color-destructive-shadow)_-1px_-1px_0_3px]",
          "focus:shadow-[var(--color-destructive-text)_1px_1px_0_3px] focus:outline-0",
        ],
        "super-destructive": [
          "px-2 py-1.5 text-base font-bold border-0 cursor-pointer transition-all duration-200 ease-in-out",
          "text-black bg-destructive-shadow",
          "shadow-[var(--color-black)_1px_1px_0_2px]",
          "hover:shadow-[var(--color-black)_1px_1px_0_3px]",
          "active:shadow-[var(--color-black)_-1px_-1px_0_3px]",
        ],
        navigation: [
          "w-full flex items-center px-2 py-4 cursor-pointer text-base border-0 transition-colors duration-300",
          "text-[var(--color-text)] bg-inherit border-b border-divider",
          "hover:bg-background-hover",
          "focus:bg-background-focus",
          "focus:outline focus:outline-2 focus:outline",
          "data-[active=true]:bg-background-active",
        ],
        basic: [
          "cursor-pointer font-bold border h-9 px-2",
          "bg-inherit text-inherit border-border",
          "active:bg-background-focus",
          "hover:not(:active):bg-background-hover",
        ],
      },
    },
    compoundVariants: [
      {
        variant: ["link", "basic"],
        class: "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      },
    ],
    defaultVariants: {
      variant: "basic",
    },
  },
);

export function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }), "cursor-pointer")}
      {...props}
    />
  );
}
