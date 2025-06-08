import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import Sidebar from "~/components/layout/sidebar";
import MobileHeader from "~/components/layout/mobile-header";
import MobileSidebar from "~/components/layout/mobile-sidebar";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function ContentLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <Sidebar />
      <main className="flex flex-col flex-1 overflow-y-auto scrollbar-custom h-screen px-lg pt-global-header-height md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
