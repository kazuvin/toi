import { cn } from "~/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

type AppBarProps = ComponentPropsWithoutRef<"header"> & {
  className?: string;
};

export default function AppBar({ className, ...props }: AppBarProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between w-screen h-global-header-height flex-1 px-lg py-md bg-none",
        className
      )}
      {...props}
    >
      <Link to="/" className="flex items-center gap-sm">
        <span className="text-lg font-bold">Toi</span>
      </Link>
      <div className="flex items-center gap-sm">
        <Button size="sm" variant="default">
          ログイン
        </Button>
        <Button size="sm" variant="accent">
          サインアップ
        </Button>
      </div>
    </header>
  );
}
