import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Sidebar from "~/components/layout/sidebar";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function ChatLayout() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-pink-950/10 via-gray-100 to-violet-950/5">
      <Sidebar />
      <main className="flex flex-col flex-1 overflow-y-auto scrollbar-custom h-screen px-lg">
        <Outlet />
      </main>
    </div>
  );
}
