import React from "react";
import { cn } from "@/lib/utils";

const Loader = ({
  size = "md",
  variant = "default",
  className,
  text,
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const variants = {
    default: "border-primary",
    secondary: "border-secondary",
    muted: "border-muted-foreground",
  };

  const spinnerClass = cn(
    "animate-spin rounded-full border-2 border-transparent border-t-current",
    sizeClasses[size],
    variants[variant],
    className
  );

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={spinnerClass} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          overlay && "bg-background/80 backdrop-blur-sm"
        )}
      >
        <LoaderContent />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <LoaderContent />
    </div>
  );
};

// Specific loader variations for common use cases
export const PageLoader = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader size="lg" text={text} />
  </div>
);

export const ButtonLoader = ({ text = "Loading..." }) => (
  <div className="flex items-center gap-2">
    <Loader size="sm" />
    <span className="text-sm">{text}</span>
  </div>
);

export const SectionLoader = ({ text = "Loading...", height = "h-32" }) => (
  <div className={cn("flex items-center justify-center", height)}>
    <Loader size="md" text={text} />
  </div>
);

export const OverlayLoader = ({ text = "Processing..." }) => (
  <Loader size="lg" text={text} fullScreen overlay />
);

export default Loader;
