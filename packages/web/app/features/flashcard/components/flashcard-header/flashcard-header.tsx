import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { LearningSettingsDialog } from "../learning-settings-dialog";

type FlashcardHeaderProps = {
  title: string;
};

export function FlashcardHeader({ title }: FlashcardHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-center relative md:justify-between">
        {/* Title - centered on mobile, left-aligned on desktop with proper truncation */}
        <h1 className="text-xl font-bold text-gray-800 truncate text-center md:text-left max-w-[calc(100%-4rem)] md:max-w-none">
          {title}
        </h1>
        
        {/* Settings icon - fixed at top right */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 absolute right-0 top-1/2 transform -translate-y-1/2 md:relative md:right-auto md:top-auto md:transform-none"
              aria-label="学習設定"
            >
              <Settings className="h-4 w-4" />
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