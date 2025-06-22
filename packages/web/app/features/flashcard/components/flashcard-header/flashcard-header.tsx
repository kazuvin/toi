import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { LearningSettingsDialog } from "../learning-settings-dialog";
import { useScroll } from "~/hooks/use-scroll";
import { cn } from "~/lib/utils";

type FlashcardHeaderProps = {
  title: string;
};

export function FlashcardHeader({ title }: FlashcardHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isScrolled = useScroll();

  return (
    <div 
      className={cn(
        "top-0 z-10 px-4 py-3 transition-all duration-200",
        // Mobile: fixed positioning, Desktop: sticky positioning
        "fixed md:sticky",
        // Transparent background with blur when scrolled
        isScrolled ? "bg-white/80 backdrop-blur-md" : "bg-transparent",
        // Border only when scrolled
        isScrolled && "border-b border-gray-200/50"
      )}
    >
      <div className="flex items-center justify-center relative md:justify-between">
        {/* Title - centered on mobile, left-aligned on desktop with proper truncation */}
        <h1 className="text-xl font-bold text-gray-800 truncate text-center md:text-left max-w-[calc(100%-4rem)] md:max-w-none">
          {title}
        </h1>
        
        {/* Settings icon - styled like hamburger menu */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="p-1.5 size-10 bg-card/30 backdrop-blur-md absolute right-0 top-1/2 transform -translate-y-1/2 md:relative md:right-auto md:top-auto md:transform-none"
              aria-label="学習設定"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>学習設定</DialogTitle>
            </DialogHeader>
            <LearningSettingsDialog />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}