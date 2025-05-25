import { cn } from "~/lib/utils";
import { ComponentPropsWithoutRef, useState } from "react";
import { User, ChevronLeft, ChevronRight } from "lucide-react";

type AccountInfoProps = ComponentPropsWithoutRef<"div"> & {
  isOpen: boolean;
};

function AccountInfo({ isOpen }: AccountInfoProps) {
  return (
    <div className="flex items-center gap-sm py-sm">
      <button className="p-2 bg-muted-foreground/20 rounded-sm transition-colors">
        <div className="size-4 flex items-center justify-center">
          <User className="size-4" />
        </div>
      </button>
      <div
        className={cn(
          "text-xl font-bold whitespace-nowrap transition-opacity duration-300",
          !isOpen ? "opacity-0" : "opacity-100"
        )}
      >
        <p className="text-sm font-medium truncate">Kazuvin</p>
        <p className="text-xs text-muted-foreground truncate">無料プラン</p>
      </div>
    </div>
  );
}

type SidebarProps = ComponentPropsWithoutRef<"aside"> & {
  className?: string;
};

export default function Sidebar({ className, ...props }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={cn(
        "flex flex-col h-full px-sm border-r-[0.5px] border-border transition-all duration-300 bg-card/30 backdrop-blur-md",
        isOpen ? "w-64" : "w-12",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-sm py-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-muted-foreground/10 rounded-sm transition-colors"
        >
          <div className="size-4 flex items-center justify-center">
            {isOpen ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </div>
        </button>
        <div
          className={cn(
            "text-xl font-bold whitespace-nowrap transition-opacity duration-300",
            !isOpen ? "opacity-0" : "opacity-100"
          )}
        >
          Toi
        </div>
      </div>
      <div className="flex items-center mt-auto h-16">
        <AccountInfo isOpen={isOpen} />
      </div>
    </aside>
  );
}
