import { cn } from "~/lib/utils";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { User, X, MessageSquare, PlusCircle, Shield } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import useSWR from "swr";
import { getSources } from "~/services/sources";
import { Spinner } from "../../ui/spinner/spinner";
import AccountInfoDialog from "../account-info-dialog";

type SidebarItemProps = {
  children: React.ReactNode;
  renderIcon?: () => React.ReactNode;
  to: string;
  onClick?: () => void;
};

type MobileSidebarProps = ComponentPropsWithoutRef<"aside"> & {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

function AccountInfo({ onAccountClick }: { onAccountClick: () => void }) {
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
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">Kazuvin</p>
        <p className="text-xs text-muted-foreground truncate">無料プラン</p>
      </div>
    </div>
  );
}

function SidebarItem({ children, renderIcon, to, onClick }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-sm hover:bg-muted-foreground/10 rounded-sm transition-colors w-full min-w-0"
      onClick={onClick}
    >
      {renderIcon && (
        <div className="p-2 rounded-sm transition-colors flex-shrink-0">
          <div className="size-4 flex items-center justify-center">
            {renderIcon()}
          </div>
        </div>
      )}
      <div
        className={cn(
          "flex items-center h-8 text-sm font-medium min-w-0 flex-1",
          renderIcon ? "" : "px-sm"
        )}
      >
        <span className="truncate">{children}</span>
      </div>
    </Link>
  );
}

function MobileSidebar({
  className,
  isOpen,
  onClose,
  ...props
}: MobileSidebarProps) {
  const { data: sources } = useSWR("/api/sources", getSources);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

  // モバイルサイドバーが開いている時はbodyのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // クリーンアップ関数でスクロールを復元
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* オーバーレイ */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
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

      {/* メニュー */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-2/3 max-w-xs px-sm border-r border-border transition-transform duration-300 bg-card/95 backdrop-blur-md flex flex-col min-w-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-sm p-sm min-w-0">
          <div className="text-xl font-bold min-w-0 flex-1">
            <span className="truncate">Toi</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="p-2 flex-shrink-0"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-sm mt-md min-w-0">
          <SidebarItem
            renderIcon={() => <PlusCircle className="size-4" />}
            to="/new"
            onClick={onClose}
          >
            新しく作成する
          </SidebarItem>
          <SidebarItem
            renderIcon={() => <MessageSquare className="size-4" />}
            to="/contents"
            onClick={onClose}
          >
            コンテンツ一覧
          </SidebarItem>
        </div>

        <div className="flex flex-col gap-sm mt-lg min-w-0 flex-1 overflow-hidden">
          <h2 className="text-xs px-sm pb-sm flex-shrink-0 min-w-0">
            <span className="truncate">最近の項目</span>
          </h2>
          <div className="flex flex-col gap-sm overflow-y-auto min-w-0">
            {sources?.map((source) => (
              <SidebarItem
                key={source.id}
                to={`/content/${source.id}`}
                onClick={onClose}
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
        </div>

        <div className="mt-auto flex-shrink-0 space-y-2">
          <SidebarItem
            renderIcon={() => <Shield className="size-4" />}
            to="/privacy"
            onClick={onClose}
          >
            プライバシーポリシー
          </SidebarItem>
          <AccountInfo onAccountClick={() => setIsAccountDialogOpen(true)} />
        </div>
      </aside>

      <AccountInfoDialog
        isOpen={isAccountDialogOpen}
        onClose={() => setIsAccountDialogOpen(false)}
      />
    </>
  );
}

export default MobileSidebar;
