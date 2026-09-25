import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { ButtonProps } from "./types";

const BASE_STYLES =
  "flex gap-1 items-center font-medium text-sm px-5 py-3 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS: Record<string, string> = {
  primary:
    "bg-white text-secondary border-secondary hover:bg-lightGray hover:text-black",
  "primary-outline":
    "bg-white text-primary-150 border-primary-150 hover:bg-primary-100 hover:text-white font-bold",
  "primary-fill": "bg-primary-150 text-white border-primary hover:bg-primary/90",
  secondary: "bg-primary-150 text-white border-primary hover:bg-primary/90",
  danger: "bg-red-600 text-white border-red-600 hover:bg-red-700",
  outline: "bg-white text-primary border-primary hover:bg-primary/10",
  ghost:
    "bg-transparent text-secondary border-transparent hover:bg-primary/10 p-2",
  inline:
    "bg-transparent text-gray-500 border-none hover:text-gray-600 underline shadow-none p-0 m-0",
};

const SIZES: Record<string, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      type = "button",
      onClick,
      disabled = false,
      variant = "primary",
      size = "md",
      ...props
    },
    ref
  ) => {
    const variantStyles = VARIANTS[variant] || VARIANTS.primary;
    const sizeStyles = SIZES[size];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          BASE_STYLES,
          variantStyles,
          size !== "md" && sizeStyles,
          className
        )}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
