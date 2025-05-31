import { cn } from "~/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        primary: "text-primary",
        accent: "text-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
} & VariantProps<typeof spinnerVariants>;

export function Spinner({ className, size = "md", variant }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={cn(spinnerVariants({ variant }), sizeClasses[size], className)}
      role="status"
      aria-label="読み込み中"
    >
      <span className="sr-only">読み込み中...</span>
    </div>
  );
}
