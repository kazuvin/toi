import { cn } from "~/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { User, X, MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";

function AccountInfo() {
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
      <div className="text-xl font-bold whitespace-nowrap">
        <p className="text-sm font-medium truncate">Kazuvin</p>
        <p className="text-xs text-muted-foreground truncate">無料プラン</p>
      </div>
    </div>
  );
}

function SidebarItem({
  children,
  renderIcon,
  to,
}: {
  children: React.ReactNode;
  renderIcon: () => React.ReactNode;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-sm hover:bg-muted-foreground/10 rounded-sm transition-colors"
    >
      <div className="p-2 rounded-sm transition-colors">
        <div className="size-4 flex items-center justify-center">
          {renderIcon()}
        </div>
      </div>
      <div className="text-sm font-medium whitespace-nowrap">{children}</div>
    </Link>
  );
}

type MobileSidebarProps = ComponentPropsWithoutRef<"aside"> & {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileSidebar({
  className,
  isOpen,
  onClose,
  ...props
}: MobileSidebarProps) {
  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onClose();
            }
          }}
          aria-label="メニューを閉じる"
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-2/3 px-sm border-r border-border transition-transform duration-300 bg-card/95 backdrop-blur-md flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-sm p-sm">
          <div className="text-xl font-bold">Toi</div>
          <Button variant="ghost" size="icon" onClick={onClose} className="p-2">
            <X className="size-5" />
          </Button>
        </div>
        <div className="flex flex-col gap-sm mt-md">
          <SidebarItem
            renderIcon={() => <PlusCircle className="size-4" />}
            to="/new"
          >
            新しく作成する
          </SidebarItem>
          <SidebarItem
            renderIcon={() => <MessageSquare className="size-4" />}
            to="/contents"
          >
            コンテンツ一覧
          </SidebarItem>
        </div>
        <div className="mt-auto">
          <AccountInfo />
        </div>
      </aside>
    </>
  );
}
