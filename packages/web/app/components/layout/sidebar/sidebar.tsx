import { cn } from "~/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { Link } from "@remix-run/react";

function MainItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-sm px-md py-sm text-sm text-muted-foreground hover:bg-muted-foreground/10 hover:text-muted-foreground rounded-sm transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}

function SidebarItem({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-sm px-md py-sm text-sm text-muted-foreground hover:bg-muted-foreground/10 hover:text-muted-foreground rounded-sm transition-colors"
    >
      {children}
    </Link>
  );
}

type SidebarProps = ComponentPropsWithoutRef<"aside"> & {
  className?: string;
};

export default function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <aside className={cn("bg-none w-64 px-sm", className)} {...props}>
      <nav className="flex flex-col gap-xs">
        <MainItem className="text-primary hover:text-primary hover:bg-primary/10">
          ⭐️ 新しく問題集を作る
        </MainItem>
        <MainItem>🔍 問題集一覧</MainItem>
        <h2 className="px-md pb-sm pt-lg text-xs font-light text-muted-foreground">
          最近の項目
        </h2>
        <SidebarItem to="/">英語学習</SidebarItem>
        <SidebarItem to="/dashboard">UIデザインのアイデア帳</SidebarItem>
        <SidebarItem to="/settings">コードトーンアプローチ</SidebarItem>
      </nav>
    </aside>
  );
}
