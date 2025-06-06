import { cn } from "~/lib/utils";
import { ComponentPropsWithoutRef, useState } from "react";
import {
  User,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  PlusCircle,
} from "lucide-react";
import { Link } from "@remix-run/react";
import useSWR from "swr";
import { getSources } from "~/services/sources";
import { Spinner } from "~/components/ui/spinner";

type AccountInfoProps = ComponentPropsWithoutRef<"div"> & {
  isOpen: boolean;
};

function AccountInfo({ isOpen }: AccountInfoProps) {
  return (
    <div className="flex items-center gap-sm py-sm">
      <Link
        to="/account"
        className="p-2 bg-muted-foreground/20 rounded-sm transition-colors"
      >
        <div className="size-4 flex items-center justify-center">
          <User className="size-4" />
        </div>
      </Link>
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

function SidebarItem({
  children,
  isOpen,
  renderIcon,
  to,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  renderIcon?: () => React.ReactNode;
  to: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-sm",
        isOpen
          ? "hover:bg-muted-foreground/10 rounded-sm transition-colors"
          : ""
      )}
    >
      {renderIcon && (
        <div
          className={cn(
            "p-2 rounded-sm transition-colors",
            isOpen ? "" : "hover:bg-muted-foreground/10"
          )}
        >
          <div className="size-4 flex items-center justify-center">
            {renderIcon()}
          </div>
        </div>
      )}
      <div
        className={cn(
          "flex items-center h-8 text-sm font-medium whitespace-nowrap transition-opacity duration-300 truncate",
          isOpen ? "opacity-100" : "opacity-0",
          renderIcon ? "" : "px-sm"
        )}
      >
        {children}
      </div>
    </Link>
  );
}

type SidebarProps = ComponentPropsWithoutRef<"aside"> & {
  className?: string;
};

export default function Sidebar({ className, ...props }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { data: sources } = useSWR("/api/sources", getSources);

  return (
    <aside
      className={cn(
        "flex flex-col h-full px-sm border-r-[0.5px] border-border transition-all duration-300 bg-card/30 backdrop-blur-md",
        isOpen ? "w-64" : "w-12",
        "hidden md:flex",
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
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          Toi
        </div>
      </div>
      <div className="flex flex-col gap-sm mt-md">
        <SidebarItem
          isOpen={isOpen}
          renderIcon={() => <PlusCircle className="size-4" />}
          to="/new"
        >
          新しく作成する
        </SidebarItem>
        <SidebarItem
          isOpen={isOpen}
          renderIcon={() => <MessageSquare className="size-4" />}
          to="/contents"
        >
          コンテンツ一覧
        </SidebarItem>
      </div>

      <div className="flex flex-col gap-sm mt-lg">
        <h2
          className={cn(
            "text-xs px-sm pb-sm truncate transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          最近の項目
        </h2>
        {sources?.map((source) => (
          <SidebarItem
            key={source.id}
            isOpen={isOpen}
            to={`/content/${source.id}`}
          >
            {source.title || (
              <div className="flex items-center gap-md min-w-0">
                <Spinner size="sm" className="flex-shrink-0" />
                <span className="text-muted-foreground truncate">
                  生成中...
                </span>
              </div>
            )}
          </SidebarItem>
        ))}
      </div>

      <div className="flex items-center mt-auto h-16">
        <AccountInfo isOpen={isOpen} />
      </div>
    </aside>
  );
}
