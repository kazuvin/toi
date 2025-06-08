import { Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";

type ContentCreationButtonProps = {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
};

export function ContentCreationButton({
  disabled,
  isLoading,
  onClick,
}: ContentCreationButtonProps) {
  return (
    <div className="flex justify-center">
      <Button
        disabled={disabled}
        className="rounded p-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        onClick={onClick}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>生成中...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>学習コンテンツを作成</span>
          </div>
        )}
      </Button>
    </div>
  );
}
