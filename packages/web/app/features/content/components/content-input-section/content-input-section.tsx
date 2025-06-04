import { Button } from "~/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type ContentInputSectionProps = {
  content?: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
};

export function ContentInputSection({
  content,
  isExpanded,
  onToggleExpanded,
}: ContentInputSectionProps) {
  return (
    <div className="p-6 rounded border border-border bg-card/30 backdrop-blur-sm flex flex-col gap-sm">
      <h2 className="font-bold">入力</h2>
      <div className="relative">
        <p
          className={`text-sm text-muted-foreground transition-all duration-300 ease-in-out ${
            !isExpanded ? "line-clamp-3" : ""
          }`}
        >
          {content}
        </p>
      </div>
      <div className="flex items-center justify-center mt-md">
        <Button variant="outline" size="icon" onClick={onToggleExpanded}>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}
