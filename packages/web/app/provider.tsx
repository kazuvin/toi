import { Toaster } from "~/components/ui/toaster";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
