import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "circle" | "rect";
}

const variantClasses: Record<string, string> = {
  text: "h-4 w-full rounded",
  card: "h-32 w-full rounded-xl",
  circle: "h-10 w-10 rounded-full",
  rect: "h-20 w-full rounded-lg",
};

export default function Skeleton({ className, variant = "text" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 dark:bg-slate-700/50",
        variantClasses[variant],
        className
      )}
    />
  );
}
