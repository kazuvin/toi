import { cn } from "~/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";

type MobileHeaderProps = ComponentPropsWithoutRef<"header"> & {
  className?: string;
  onMenuClick: () => void;
};

export default function MobileHeader({
  className,
  onMenuClick,
  ...props
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full h-global-header-height p-lg  md:hidden",
        className
      )}
      {...props}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onMenuClick}
        className="p-2 size-12 bg-card/30 backdrop-blur-md"
      >
        <Menu className="w-full" />
      </Button>
    </header>
  );
}
