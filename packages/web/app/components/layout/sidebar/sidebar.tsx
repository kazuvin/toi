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
import AccountInfoDialog from "../account-info-dialog";

type AccountInfoProps = ComponentPropsWithoutRef<"div"> & {
  isOpen: boolean;
  onAccountClick: () => void;
};

function AccountInfo({ isOpen, onAccountClick }: AccountInfoProps) {
  return (
    <div className="flex items-center gap-sm py-sm min-w-0">
      <button
        onClick={onAccountClick}
        className="p-2 bg-muted-foreground/20 rounded-sm transition-colors flex-shrink-0 hover:bg-muted-foreground/30"
      >
        <div className="size-4 flex items-center justify-center">
          <User className="size-4" />
        </div>
      </button>
      <div
        className={cn(
          "transition-opacity duration-300 min-w-0 flex-1",
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
        "flex items-center gap-sm min-w-0",
        isOpen
          ? "hover:bg-muted-foreground/10 rounded-sm transition-colors"
          : ""
      )}
    >
      {renderIcon && (
        <div
          className={cn(
            "p-2 rounded-sm transition-colors flex-shrink-0",
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
          "flex items-center h-8 text-sm transition-opacity duration-300 min-w-0 flex-1",
          isOpen ? "opacity-100" : "opacity-0",
          renderIcon ? "" : "px-sm"
        )}
      >
        <span className="truncate">{children}</span>
      </div>
    </Link>
  );
}

type SidebarProps = ComponentPropsWithoutRef<"aside"> & {
  className?: string;
};

export default function Sidebar({ className, ...props }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
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
      <div className="flex items-center gap-sm py-sm min-w-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-muted-foreground/10 rounded-sm transition-colors flex-shrink-0"
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
            "text-xl font-bold transition-opacity duration-300 min-w-0 flex-1",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="truncate">Toi</span>
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
            "text-xs px-sm pb-sm transition-opacity duration-300 min-w-0",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          <span className="truncate">最近の項目</span>
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
        <AccountInfo 
          isOpen={isOpen} 
          onAccountClick={() => setIsAccountDialogOpen(true)}
        />
      </div>

      <AccountInfoDialog
        isOpen={isAccountDialogOpen}
        onClose={() => setIsAccountDialogOpen(false)}
      />
    </aside>
  );
}
